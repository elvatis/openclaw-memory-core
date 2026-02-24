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

export interface MemoryStore {
  add(item: MemoryItem): Promise<void>;
  search(query: string, opts?: { limit?: number }): Promise<SearchHit[]>;
  list?(opts?: { limit?: number }): Promise<MemoryItem[]>;
}

export interface RedactionResult {
  redactedText: string;
  hadSecrets: boolean;
  matches: Array<{ rule: string; match: string }>;
}

export interface Redactor {
  redact(text: string): RedactionResult;
}

export interface Embedder {
  embed(text: string): Promise<number[]>;
  dims: number;
  id: string;
}
