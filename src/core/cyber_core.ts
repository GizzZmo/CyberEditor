// src/core/cyber_core.ts
import { TextBuffer } from './text_buffer.js';
import { PluginHost } from '../plugins/plugin_host.js';
import { CyberEditorAPI } from '../plugins/plugin_api.js';
import { CompletionProvider, CompletionItem, isCompletionProvider } from '../features/completion_provider.js';
import chalk from 'chalk';

export class CyberCore {
  public readonly buffer: TextBuffer;
  private readonly pluginHost: PluginHost;
  private completionProviders: CompletionProvider[] = [];

  constructor() {
    this.buffer = new TextBuffer();
    
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
        // FIX #1: Add a type guard to prove to the linter that the provider is valid.
        // This satisfies all the "no-unsafe-*" rules for the provider.
        if (isCompletionProvider(provider)) {
          const completions = provider.provideCompletions(currentLine, column);
          if (completions && completions.length > 0) {
              allCompletions = [...allCompletions, ...completions];
          }
        }
      } catch (e) {
        // FIX #2: Handle the 'unknown' error type safely.
        // This satisfies the 'restrict-template-expressions' rule.
        if (e instanceof Error) {
          console.error(chalk.red(`Error in completion provider: ${e.message}`));
        } else {
          console.error(chalk.red('An unknown error occurred in a completion provider.'), e);
        }
      }
    }
    return allCompletions;
  }
}
