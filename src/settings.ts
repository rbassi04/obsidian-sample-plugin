import ExamplePlugin from './main';
import { App, Notice, PluginSettingTab, Setting } from 'obsidian';

export class ExampleSettingTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();
    const dateDesc = document.createDocumentFragment();  
    dateDesc.appendText('For a list of all available tokens, see the ');  
    dateDesc.createEl('a', {  
        text: 'format reference',  
        attr: { href: 'https://momentjs.com/docs/#/displaying/format/', target: '_blank' }  
    });  
    dateDesc.createEl('br');  
    dateDesc.appendText('Your current syntax looks like this: ');  
    const dateSampleEl = dateDesc.createEl('b', 'u-pop');  
    new Setting(containerEl)  
        .setName('Date format')  
        .setDesc(dateDesc)  
        .addMomentFormat(momentFormat => momentFormat  
          .setValue(this.plugin.settings.dateFormat)  
          .setSampleEl(dateSampleEl)  
          .setDefaultFormat('MMMM dd, yyyy')  
          .onChange(async (value) => {  
              this.plugin.settings.dateFormat = value;  
              await this.plugin.saveSettings();  
          }));
    new Setting(containerEl)  
        .setName('Toggle')  
        .addToggle(toggle => toggle  
          .setValue(this.plugin.settings.localServer)  
          .onChange(async (value) => {  
              this.plugin.settings.localServer = value;  
              await this.plugin.saveSettings();  
              this.display();
          })
        );
  }
}