import { App, FuzzySuggestModal } from 'obsidian';

export class FolderSuggestModal extends FuzzySuggestModal<string> {
    app: App;
    onChoose: Function;
    
    constructor(app: App, onChoose: Function) {
      super(app);
      this.onChoose = onChoose;
      this.app = app
      this.open()
    }

    getItems() {
        return this.app.vault.getAllLoadedFiles()
            .filter(file => file.children)
            .map(folder => folder.path);
    }

    getItemText(item: string) {
        return item;
    }

    onChooseItem(item: string) {
        this.onChoose(item);
    }
}