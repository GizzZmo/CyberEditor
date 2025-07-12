// src/plugins/plugin_host.ts
import { CyberEditorAPI } from './plugin_api.js';
import { EditorError, ErrorCode } from '../core/errors.js';
import chalk from 'chalk';

interface PluginModule {
  activate(api: CyberEditorAPI): void;
}

export class PluginHost {
  private loadedPlugins: Map<string, PluginModule> = new Map();

  constructor(private api: CyberEditorAPI) {}

  public async loadPlugin(pluginId: string, path: string): Promise<void> {
    console.log(chalk.gray(`[PluginHost] Loading plugin '${pluginId}' from ${path}...`));
    try {
      // Dynamic import() is the modern, async way to load modules
      const pluginModule = (await import(path)) as PluginModule;

      if (typeof pluginModule.activate !== 'function') {
        throw new Error('Plugin does not have an activate function.');
      }

      this.loadedPlugins.set(pluginId, pluginModule);
      this.activatePlugin(pluginId, pluginModule);
    } catch (e) {
      throw new EditorError(
        `Failed to load plugin: ${pluginId}`,
        ErrorCode.PluginLoadFailed,
        e instanceof Error ? e : new Error(String(e))
      );
    }
  }

  private activatePlugin(pluginId: string, plugin: PluginModule): void {
    console.log(chalk.cyan(`[PluginHost] Activating plugin '${pluginId}'...`));
    try {
      // The plugin is given a restricted API, not access to the whole editor
      plugin.activate(this.api);
    } catch (e) {
      // CRITICAL: A faulty plugin will not crash the editor, it just throws an error.
      throw new EditorError(
        `Error during activation of plugin: ${pluginId}`,
        ErrorCode.PluginActivationFailed,
        e instanceof Error ? e : new Error(String(e))
      );
    }
  }
}
