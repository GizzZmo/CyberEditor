// src/index.ts
import { CyberCore } from './core/cyber_core.js';
import { EditorError } from './core/errors.js';
import { CompletionItem } from './features/completion_provider.js';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FIX #1: Add an explicit return type to the function signature.
async function main(): Promise<void> {
  const editor = new CyberCore();

  try {
    await editor.initialize();

    const pluginPath = path.join(__dirname, './plugins/example_plugin.js');
    await editor.loadPlugin('cyber-keywords', pluginPath);

    console.log(chalk.bold.blue('\n--- Simulating User Input ---'));
    editor.buffer.insert(0, 0, 'const stream = new cy');
    console.log(chalk.cyan('User types: ') + editor.buffer.getFullText());

    const completions = editor.requestCompletionsAt(0, 21);
    
    if (completions.length > 0) {
        console.log(chalk.green.bold('Autocomplete suggestions found:'));
        // FIX #2: Although the previous fix helps, being explicit here is best.
        // We'll ensure `c` is a valid object before accessing its properties.
        completions.forEach((c: CompletionItem) => {
          if (c && c.label) {
            console.log(chalk.green(`  - ${c.label} (${c.detail || ''})`));
          }
        });
    } else {
        console.log(chalk.yellow('No autocomplete suggestions found.'));
    }

    console.log(chalk.bold.blue('\n--- Simulation Complete ---'));

  } catch (error) {
    if (error instanceof EditorError) {
      console.error(chalk.red.bold(`\n[FATAL EDITOR ERROR] Code: ${error.code}`));
      console.error(chalk.red(error.message));
      if (error.originalError) {
        console.error(chalk.red.dim('Original Error: ' + error.originalError.stack));
      }
    } else {
      console.error(chalk.red.bold('\n[UNHANDLED FATAL ERROR]'), error);
    }
    process.exit(1);
  }
}

// FIX #3: Handle the floating promise.
// The .catch() block ensures that any unexpected rejection from main() is caught.
main().catch((err) => {
  console.error(chalk.bgRed.white.bold('A critical unhandled error occurred in main execution:'), err);
  process.exit(1);
});
