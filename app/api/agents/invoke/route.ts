import { NextRequest, NextResponse } from 'next/server'
import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from '@aws-sdk/client-bedrock-agentcore'
import { Readable } from 'stream'

const AGENT_ARNS: Record<string, string> = {
  pitch_builder:     'arn:aws:bedrock-agentcore:us-east-1:646731024209:runtime/pitch_builder-5izhaw4oB7',
  meeting_preparer:  'arn:aws:bedrock-agentcore:us-east-1:646731024209:runtime/meeting_preparer-GlEUwZCPBB',
  earnings_reviewer: 'arn:aws:bedrock-agentcore:us-east-1:646731024209:runtime/earnings_reviewer-jB93znBSo7',
  model_builder:     'arn:aws:bedrock-agentcore:us-east-1:646731024209:runtime/model_builder-MH0oy6Gyhx',
  memo_maker:        'arn:aws:bedrock-agentcore:us-east-1:646731024209:runtime/memo_maker-w2T7hc8rZS',
}

const client = new BedrockAgentCoreClient({ region: 'us-east-1' })

async function readStream(stream: Readable): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}

export async function POST(req: NextRequest) {
  try {
    const { agent, payload } = await req.json()

    const arn = AGENT_ARNS[agent]
    if (!arn) return NextResponse.json({ error: `Unknown agent: ${agent}` }, { status: 400 })

    const sessionId = `rm-${crypto.randomUUID().replace(/-/g, '')}-${Date.now()}`

    const command = new InvokeAgentRuntimeCommand({
      agentRuntimeArn: arn,
      runtimeSessionId: sessionId,
      qualifier: 'DEFAULT',
      payload: Buffer.from(JSON.stringify(payload)),
      contentType: 'application/json',
      accept: 'application/json',
    })

    const result = await client.send(command)

    const text = result.response ? await readStream(result.response as Readable) : ''
    let data: unknown
    try { data = JSON.parse(text) } catch { data = { raw: text } }

    return NextResponse.json({ ok: true, agent, sessionId, data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
