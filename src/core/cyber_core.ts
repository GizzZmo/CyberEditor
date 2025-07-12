// src/core/cyber_core.ts
import { TextBuffer } from './text_buffer.js';
import { PluginHost } from '../plugins/plugin_host.js';
import { CyberEditorAPI } from '../plugins/plugin_api.js';
import { CompletionProvider, CompletionItem } from '../features/completion_provider.js';
import chalk from 'chalk';

export class CyberCore {
  public readonly buffer: TextBuffer;
  private readonly pluginHost: PluginHost;
  private completionProviders: CompletionProvider[] = [];

  constructor() {
    this.buffer = new TextBuffer();
    
    // The API object passed to plugins is carefully constructed
    // to expose only what is safe and necessary.
    const api: CyberEditorAPI = {
      registerCompletionProvider: (provider) => this.completionProviders.push(provider),
      log: (message: string) => console.log(chalk.magenta(`[Plugin Log] ${message}`)),
      buffer: {
        getLine: (lineNumber: number) => this.buffer.getLine(lineNumber),
        getLineCount: () => this.buffer.getLineCount(),
        getFullText: () => this.buffer.getFullText(),
      }
    };
    
    this.pluginHost = new PluginHost(api);
  }

  async initialize(): Promise<void> {
    console.log(chalk.bold.yellow('CyberEditor core initialization sequence engaged...'));
    // Simulate intensive startup tasks
    await new Promise(resolve => setTimeout(resolve, 50)); 
    console.log(chalk.green('Core systems online.'));
  }

  async loadPlugin(pluginId: string, path: string): Promise<void> {
    await this.pluginHost.loadPlugin(pluginId, path);
  }

  requestCompletionsAt(line: number, column: number): CompletionItem[] {
    const currentLine = this.buffer.getLine(line);
    let allCompletions: CompletionItem[] = [];

    console.log(chalk.gray(`\nRequesting completions for line ${line}, column ${column}: "${currentLine}"`));

    for (const provider of this.completionProviders) {
      try {
        const completions = provider.provideCompletions(currentLine, column);
        if (completions.length > 0) {
            allCompletions = [...allCompletions, ...completions];
        }
      } catch (e) {
        console.error(chalk.red(`Error in completion provider: ${e}`));
      }
    }
    return allCompletions;
  }
}
