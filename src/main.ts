import { MarkdownView, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addRibbonIcon('dice', 'Print leaf types', () => {
      this.app.workspace.iterateAllLeaves((leaf) => {
        console.log(leaf.getViewState().type);
      });
    });
  }
}