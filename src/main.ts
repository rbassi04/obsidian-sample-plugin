import { App, Modal, Notice, Plugin, setIcon, Setting } from "obsidian";

import { ExampleSettingTab } from './settings';

interface ExamplePluginSettings {
  dateFormat: string;
	localServer: boolean
}

const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
  dateFormat: "JULY 10, 2026",
	localServer: true
};

export default class ExamplePlugin extends Plugin {
  async onload() {
    console.log("OK")
    this.registerView(
      VIEW_TYPE_EXAMPLE,
      (leaf) => new ExampleView(leaf)
    );

    this.addRibbonIcon('dice', 'Activate view', () => {
      this.activateView();
    });
  }

  async onunload() {
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

    if (leaves.length > 0) {
			console.log(leaves)
      // A leaf with our view already exists, use that
      leaf = leaves[0]!;
    } else {
			console.log("VIEW")
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(true)!;
      await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }
}


import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return 'Example view';
  }

  async onOpen() {
    const container = this.contentEl;
    container.empty();
    container.createEl('h4', { text: 'Example view' });
  }

  async onClose() {
    // Nothing to clean up.
  }
}