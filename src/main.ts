import { NotesModal } from 'modal/NotesModal';
import { FileSystemAdapter, Notice, Plugin } from 'obsidian';
import { ExampleSettingTab } from 'settings';
import { moment } from 'obsidian';

export interface Note {
  note: string,
  now: string
}

// The setting values
interface ExamplePluginSettings {
  persistentOnDelete: boolean;
  persistentOnInsert: boolean;
}

// Default settings
const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
  persistentOnDelete: true,
  persistentOnInsert: true,
};


export default class ExamplePlugin extends Plugin {
  notes: Note[];
  settings: ExamplePluginSettings

  async onload() {
    await this.loadNotes()
    await this.loadSettings()

    this.addCommand({
      id: "add-data",
      name: "Open Node Model",
      hotkeys: [{ modifiers: ['Alt'], key: 'a' }],
      callback: () => {
        new NotesModal(this.app, this)
      }
    })

    this.addSettingTab(new ExampleSettingTab(this.app, this));

    // this.addRibbonIcon('dice', 'Print leaf types', async () => {
    //     const tFile = await this.app.vault.create(`${Math.random()}.md`, "")
    //     await this.app.workspace.getLeaf(true).openFile(tFile);
    //     const editor = this.app.workspace.activeEditor?.editor!
    //     console.log(editor.replaceRange(this.fileContentGenerator(), editor.getCursor()))
    // });
  }

  async addNote(newNote: string) {
    this.notes.push({note: newNote, now: moment().format()})

    await this.saveData({
      settings: this.settings,
      notes: this.notes
    });
  }

  async deleteNote(index: number) {
    this.notes.splice(index, 1)

    await this.saveData({
      settings: this.settings,
      notes: this.notes
    });
  }

  // inject DEFAULT_SETTING into {} then inject this.loadData().
  async loadNotes() {
    const data = await this.loadData();
    this.notes =  data.notes ? data.notes : []
  }

    // inject DEFAULT_SETTING into {} then inject this.loadData().
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, (await this.loadData()).settings);
  }

  async saveSettings() {
    await this.saveData({
      notes: this.notes, 
      settings: this.settings
    });
  }

  async exportNotes(path: string, fName: string) {
    try {
      // autoselect
      // browse button
      let fullFileName = fName
      if (fName.split(".").length == 1) {
        fullFileName = `${fName}.md`
      }
      const tFile = await this.app.vault.create(`${path}/${fullFileName}`, this.fileContentGenerator())
      await this.app.workspace.getLeaf(true).openFile(tFile);
    } catch (e) {
      new Notice(`${e}`)
    }

  }

  fileContentGenerator() {
    const notes = this.notes.reverse()
    let noteString = ""

    noteString += notes.reduce((acc, currNote) => {
      const {note, now}: Note = currNote
      const [date, time] = now.split("T")
      const formatDate = date
      const formatTime = time!.split(":").slice(0,2)

      acc += `> \n> ${note}\n> \n\n_Signed: ${formatDate} | ${formatTime[0]}:${formatTime[1]}_ \n\n--- \n\n`
      return acc
    }, "--- \n\n")

    return noteString
  }
}