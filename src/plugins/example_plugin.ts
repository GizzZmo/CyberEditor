// src/plugins/example_plugin.ts
import { CyberEditorAPI } from './plugin_api.js';
import { CompletionProvider, CompletionItem } from '../features/completion_provider.js';

class CyberKeywordCompletionProvider implements CompletionProvider {
  provideCompletions(line: string, column: number): CompletionItem[] {
    const suggestions: CompletionItem[] = [
      { label: 'cyber_core', detail: 'The main core instance.' },
      { label: 'decompile_matrix()', detail: 'Function to analyze data structures.' },
      { label: 'ENCRYPTED_STREAM', detail: 'Represents a secure data flow.' },
    ];
    // Simple logic: return suggestions if the line includes 'cy'
    if (line.substring(0, column).includes('cy')) {
        return suggestions;
    }
    return [];
  }
}

/**
 * This is the entry point for the plugin.
 * It is called by the PluginHost when the plugin is loaded.
 */
export function activate(api: CyberEditorAPI): void {
  api.log('CyberKeywords plugin activated. Providing cyberpunk-themed completions.');
  
  const provider = new CyberKeywordCompletionProvider();
  api.registerCompletionProvider(provider);
}
