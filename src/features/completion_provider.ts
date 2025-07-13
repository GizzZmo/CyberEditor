// src/features/completion_provider.ts

export interface CompletionItem {
  label: string;
  detail: string;
}

export interface CompletionProvider {
  provideCompletions(line: string, column: number): CompletionItem[];
}

/**
 * A type guard to safely check if an object conforms to the CompletionProvider interface.
 * Using 'unknown' is safer than 'any' as it forces us to validate the type.
 * @param obj The object to check, of unknown type.
 * @returns True if the object is a valid CompletionProvider, otherwise false.
 */
export function isCompletionProvider(obj: unknown): obj is CompletionProvider {
  // 1. First, check if the object is a non-null object. This is a crucial
  //    first step before attempting to access any properties.
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // 2. Now that we know it's an object, we can safely check if it has the
  //    'provideCompletions' property and if that property is a function.
  //    The 'in' operator is a safe way to check for property existence on objects.
  return 'provideCompletions' in obj && typeof (obj as { provideCompletions: unknown }).provideCompletions === 'function';
}
