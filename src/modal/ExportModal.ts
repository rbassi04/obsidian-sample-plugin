import ExamplePlugin, { Note } from "main";
import { App, Modal, moment, Notice } from "obsidian";
import { FolderSuggestModal } from "./FolderSuggestModal";

export class ExportModal extends Modal {
  plugin: ExamplePlugin; 

  constructor(app: App, plugin: ExamplePlugin) {
    super(app);
    this.plugin = plugin;
    this.contentEl.parentElement?.classList.add("export-modal")
    
    // Display the notes
    this.displayNotes()

    this.open()
  }

  displayNotes() {
    const contentEl = this.contentEl

    // Add heading
    contentEl.createEl("h1", {
      text: 'Export notes to .md'
    })

    // Ask for path
    const pathDiv = contentEl.createDiv({
      cls: "export-path-div"
    })
    pathDiv.createEl("p", {
      text: "Export path for notes"
    })
    const pathRhsDiv = pathDiv.createDiv({
    })
    const pathInput = pathRhsDiv.createEl("input", {
      cls: "export-path-input",
      placeholder: "./qnotes/"
    })
    const browseEl = pathRhsDiv.createEl("button", {
      cls: "export-browse-btn",
      text: "Browse"
    }, el => {
      // Export button
      el.onclick = e => {
        return new FolderSuggestModal(this.app, (chosenPath: string) => {
          pathInput.value = chosenPath;
        })
      }
    })

    // Ask for file name
    const fileDiv = contentEl.createDiv({
      cls: "export-path-div"
    })
    fileDiv.createEl("p", {
      text: "Name of your notes"
    })
    const fileInput = fileDiv.createEl("input", {
      cls: "export-path-input",
      placeholder: "TodayNotes"
    })

    const errorEl = contentEl.createEl("p", {
      cls: "export-error",
      text: ""
    })
    
    // Export button
    const exportEl = contentEl.createEl("button", {
      cls: "export-export-btn",
      text: "Export..."
    }, el => {
      // Export button
      el.onclick = e => {
        // check if condition is met: 
        const folders = this.app.vault.getAllLoadedFiles()
          .filter(file => file.children)
          .map(folder => folder.path)

        folders.push("")

        let normalizedPath = pathInput.value

        // if (!folders.includes(normalizedPath)) {
        //   errorEl.innerHTML = "Use Browse Button"
        //   return
        // }
        if (!fileInput.value) {
          errorEl.innerHTML = "Choose a file name"
          return
        }
        this.plugin.exportNotes(pathInput.value, fileInput.value)
        this.close()
      }
    })

    // Keyboard functionality
    pathInput.onkeydown = e => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        browseEl.focus()
      }
      if (e.key === "ArrowUp") {
        exportEl.focus()
      }
      if (e.key === "ArrowDown") {
        fileInput.focus()
      }
    }

    // Keyboard functionality
    browseEl.onkeydown = e => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        pathInput.focus()
      }
      if (e.key === "ArrowUp") {
        exportEl.focus()
      }
      if (e.key === "ArrowDown") {
        fileInput.focus()
      }
    }

    fileInput.onkeydown = e => {
      if (e.key === "ArrowUp") {
        pathInput.focus()
      }
      if (e.key === "ArrowDown") {
        exportEl.focus()
      }
    }
    
    exportEl.onkeydown = e => {
      if (e.key === "ArrowUp") {
        fileInput.focus()
      }
      if (e.key === "ArrowDown") {
        pathInput.focus()
      }
    }
  }
}