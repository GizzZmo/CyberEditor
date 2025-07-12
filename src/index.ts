// src/index.ts
import { CyberCore } from './core/cyber_core.js';
import { EditorError } from './core/errors.js';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the correct path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const editor = new CyberCore();

  try {
    await editor.initialize();

    // Load our example plugin
    const pluginPath = path.join(__dirname, './plugins/example_plugin.js');
    await editor.loadPlugin('cyber-keywords', pluginPath);

    // --- User Simulation ---
    console.log(chalk.bold.blue('\n--- Simulating User Input ---'));
    editor.buffer.insert(0, 0, 'const stream = new cy');
    console.log(chalk.cyan('User types: ') + editor.buffer.getFullText());

    // Trigger autocompletion
    const completions = editor.requestCompletionsAt(0, 21);
    
    if (completions.length > 0) {
        console.log(chalk.green.bold('Autocomplete suggestions found:'));
        completions.forEach(c => console.log(chalk.green(`  - ${c.label} (${c.detail})`)));
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

main();
