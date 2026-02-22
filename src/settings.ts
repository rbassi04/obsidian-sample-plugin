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
      .setName('Persistent After Deleting Note')  
      .setDesc('Popup stays after you delete a note')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.persistentOnDelete)
        .onChange(e => {
          this.plugin.settings.persistentOnDelete = e
          this.plugin.saveSettings()
        })
      )
      
    new Setting(containerEl)
      .setName('Persistent After Inserting Note')  
      .setDesc('Popup stays after you insert a note')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.persistentOnDelete)
        .onChange(e => {
          this.plugin.settings.persistentOnInsert = e
          this.plugin.saveSettings()
        })
      )
  }
}