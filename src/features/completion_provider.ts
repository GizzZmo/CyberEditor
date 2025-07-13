// src/features/completion_provider.ts

export interface CompletionItem {
  label: string;
  detail: string;
}

export interface CompletionProvider {
  provideCompletions(line: string, column: number): CompletionItem[];
}

// This is a "type guard". It's a function that checks if an object
// conforms to an interface and tells the TypeScript compiler about it.
export function isCompletionProvider(obj: any): obj is CompletionProvider {
  return obj && typeof obj.provideCompletions === 'function';
}
