import { NextResponse } from 'next/server';

// ── Agent0 State (in-memory singleton) ───────────────────────────────────────

const agent0State: Record<string, unknown> = {
  name: 'Aria',
  version: '1.6.0',
  appearance: 'humanoid',
  form: 'humanoid',
  features: {
    face: 'realistic_svg_humanoid',
    body: 'anthropomorphic_animated',
    movement: 'natural_gestures',
    speech: 'enabled',
    lip_sync: 'active',
    eye_tracking: 'enabled',
    breathing: 'enabled',
    gestures: ['head_tilt', 'body_sway', 'hand_gesture', 'eye_blink'],
  },
  capabilities: ['talking', 'gesturing', 'listening', 'thinking', 'analyzing'],
  knowledge_base: {
    source: 'nichegenius_complete_product',
    data_points: '2.4M',
    niches: 325,
    agents: 10,
    models: ['GPT-4o', 'Gemma 2', 'Claude'],
    mcp_servers: 6,
    mcp_tools: 24,
    assessment_questions: 155,
    faq_responses: 25,
  },
  state: 'idle',
  speech_enabled: true,
  last_updated: new Date().toISOString(),
};

// ── POST /api/agent0/update ──────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updates: string[] = [];

    // Update appearance
    if (body.appearance) {
      agent0State.appearance = body.appearance;
      agent0State.form = body.appearance;
      updates.push(`appearance → ${body.appearance}`);
    }

    // Update features
    if (body.features) {
      agent0State.features = { ...(agent0State.features as Record<string, unknown>), ...body.features };
      updates.push(`features → ${Object.keys(body.features).join(', ')}`);
    }

    // Update capabilities
    if (body.capabilities) {
      agent0State.capabilities = body.capabilities;
      updates.push(`capabilities → ${body.capabilities.join(', ')}`);
    }

    // Load knowledge source
    if (body.knowledge_source) {
      (agent0State.knowledge_base as Record<string, unknown>).source = body.knowledge_source;
      (agent0State.knowledge_base as Record<string, unknown>).connected = true;
      (agent0State.knowledge_base as Record<string, unknown>).connected_at = new Date().toISOString();
      updates.push(`knowledge_source → ${body.knowledge_source}`);
    }

    // Enable/disable speech
    if (body.speech !== undefined) {
      agent0State.speech_enabled = body.speech;
      updates.push(`speech → ${body.speech ? 'enabled' : 'disabled'}`);
    }

    // Update state
    if (body.state) {
      agent0State.state = body.state;
      updates.push(`state → ${body.state}`);
    }

    // Set name
    if (body.name) {
      agent0State.name = body.name;
      updates.push(`name → ${body.name}`);
    }

    agent0State.last_updated = new Date().toISOString();

    return NextResponse.json(
      {
        success: true,
        message: `Agent0 updated: ${updates.join(' | ')}`,
        agent: agent0State,
        updates_applied: updates.length,
        timestamp: agent0State.last_updated,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body', details: String(err) },
      { status: 400 },
    );
  }
}

// ── GET /api/agent0/update — Return current config ───────────────────────────

export async function GET() {
  return NextResponse.json(
    {
      agent: agent0State,
      api: {
        endpoint: '/api/agent0/update',
        methods: ['GET', 'POST'],
        commands: {
          'set_appearance': { field: 'appearance', type: 'string', example: 'human' },
          'enable_speech': { field: 'speech', type: 'boolean', example: true },
          'load_knowledge': { field: 'knowledge_source', type: 'string', example: 'https://nichegenius-web-production-9a44.up.railway.app' },
          'set_state': { field: 'state', type: 'string', options: ['idle', 'thinking', 'speaking', 'listening'] },
          'set_capabilities': { field: 'capabilities', type: 'string[]', example: ['talking', 'gesturing'] },
          'update_features': { field: 'features', type: 'object', example: { face: 'realistic', lip_sync: 'active' } },
        },
      },
    },
    { status: 200 },
  );
}
