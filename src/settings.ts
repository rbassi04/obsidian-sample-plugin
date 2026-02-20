import ExamplePlugin from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class ExampleSettingTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)  
        .setName('Dropdown')  
        .addDropdown((dropdown) =>  
          dropdown  
              .addOption('1', 'Option 1')  
              .addOption('2', 'Option 2')  
              .addOption('3', 'Option 3')  
              .setValue(this.plugin.settings.mySetting)  
              .onChange(async (value) => {  
                this.plugin.settings.mySetting = value;  
                await this.plugin.saveSettings();  
              })  
        );
  }
}