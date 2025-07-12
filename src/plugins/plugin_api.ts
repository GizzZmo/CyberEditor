// src/plugins/plugin_api.ts
import { CompletionProvider } from '../features/completion_provider.js';

export interface CyberEditorAPI {
  /**
   * Registers a provider for autocompletion suggestions.
   */
  registerCompletionProvider(provider: CompletionProvider): void;

  /**
   * Logs a message to the CyberEditor console, prefixed with the plugin's ID.
   */
  log(message: string): void;

  /**
   * Provides access to the current state of the text buffer in a read-only manner.
   */
  readonly buffer: {
    getLine: (lineNumber: number) => string;
    getLineCount: () => number;
    getFullText: () => string;
  };
}
