export type MemoryKind = "fact" | "decision" | "doc" | "note";

export interface MemoryItem {
  id: string;
  kind: MemoryKind;
  text: string;
  createdAt: string; // ISO
  source?: {
    channel?: string;
    from?: string;
    conversationId?: string;
    messageId?: string;
  };
  tags?: string[];
  meta?: Record<string, unknown>;
}

export interface SearchHit {
  item: MemoryItem;
  score: number; // 0..1
}

export interface SearchOpts {
  limit?: number;
  kind?: MemoryKind;
  tags?: string[];
}

export interface MemoryStore {
  add(item: MemoryItem): Promise<void>;
  get(id: string): Promise<MemoryItem | undefined>;
  delete(id: string): Promise<boolean>;
  search(query: string, opts?: SearchOpts): Promise<SearchHit[]>;
  list(opts?: { limit?: number; kind?: MemoryKind; tags?: string[] }): Promise<MemoryItem[]>;
}

export interface RedactionResult {
  redactedText: string;
  hadSecrets: boolean;
  /** Stores only which rule fired and how many times — never the actual matched text. */
  matches: Array<{ rule: string; count: number }>;
}

export interface Redactor {
  redact(text: string): RedactionResult;
}

export interface Embedder {
  embed(text: string): Promise<number[]>;
  dims: number;
  id: string;
}

// ---------------------------------------------------------------------------
// Plugin API contract (used by openclaw-memory-brain, openclaw-memory-docs)
// ---------------------------------------------------------------------------

export interface PluginLogger {
  info?(msg: string): void;
  warn?(msg: string): void;
  error?(msg: string): void;
}

export interface CommandContext {
  args?: string;
  channel?: string;
  from?: string;
  conversationId?: string;
  messageId?: string;
}

export interface MessageEvent {
  content?: string;
  from?: string;
}

export interface MessageEventContext {
  messageProvider?: string;
  sessionId?: string;
}

export interface ToolCallParams {
  [key: string]: unknown;
}

export interface CommandDefinition {
  name: string;
  description: string;
  usage: string;
  requireAuth: boolean;
  acceptsArgs: boolean;
  handler: (ctx: CommandContext) => Promise<{ text: string }>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (params: ToolCallParams) => Promise<unknown>;
}

export interface PluginApi {
  pluginConfig?: Record<string, unknown>;
  logger?: PluginLogger;
  registerCommand(def: CommandDefinition): void;
  registerTool(def: ToolDefinition): void;
  on(event: 'message_received', handler: (event: MessageEvent, ctx: MessageEventContext) => Promise<void>): void;
}
