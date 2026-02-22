import { ExportModal } from "modal/ExportModal";
import ExamplePlugin, { Note } from "main";
import { App, Modal, moment, Notice } from "obsidian";

export class NotesModal extends Modal {
  plugin: ExamplePlugin; 

  constructor(app: App, plugin: ExamplePlugin) {
    super(app);
    this.plugin = plugin;
    this.contentEl.parentElement?.classList.add("notes-modal")
    
    // Remove header and 'x' button
    this.contentEl.parentElement?.childNodes[0]?.remove()
    this.contentEl.parentElement?.childNodes[0]?.remove()

    this.open()
  }

  render() {
    const contentEl = this.contentEl
    this.contentEl.empty();
    const containerEl = contentEl.createDiv({})

    // Input
    const inputEl = containerEl.createEl("input", {
      cls: 'input-note',
      placeholder: "Enter your note here...",
    }, el => {
      el.onkeydown = e => {
        if (e.key == "ArrowDown" && notesDiv.childNodes.length > 0) {
          (notesDiv.childNodes[0] as HTMLElement).focus()
        }
        if (e.key == "ArrowUp" && notesDiv.childNodes.length > 0) {
          exportEl.focus()
        }
      }
    })

    inputEl.addEventListener("keydown", e => {
      if (e.key == "Enter") {
        e.preventDefault()
        this.plugin.addNote(inputEl.value)
        new Notice("Inserted new Note!")

        // Close if settings say so
        if (!this.plugin.settings.persistentOnInsert) {
          this.close()
        } else {
          this.render();
        }
      }
    })

    const notesDiv = this.renderNotes(containerEl, inputEl)

    const exportEl = containerEl.createEl("button", {
      cls: "notes-export-btn",
      text: "Export..."
    })
    exportEl.onclick = e => new ExportModal(this.app, this.plugin)

        // Event listener
    exportEl.onkeydown = e => {
      // If going down
      if (e.key == "ArrowDown") {
        // If on the last index
          // Focus on button element
          inputEl.focus()
      }

      // If going up
      if (e.key == "ArrowUp") {
        const lastElement = (notesDiv.childNodes[notesDiv.childNodes.length-1] as HTMLElement)
        lastElement.focus()
      }

      if (e.key == "Enter") {
        exportEl.click()
      }
    }

    inputEl.focus()
  }

  renderNotes(containerEl: HTMLDivElement, inputEl: HTMLInputElement) {
    const notesDiv = containerEl.createDiv(
      {
        cls: "notes-div"
      }
    )

    const notes = [...this.plugin.notes]


    notes.forEach((noteObj, i) => {
      // Render notes backwards
      this.renderNoteItem(notesDiv, containerEl, inputEl, notes.length-1-i);
    })

    return notesDiv
  }

  renderNoteItem(notesDiv: HTMLDivElement, containerEl: HTMLDivElement, inputEl: HTMLInputElement, i: number) {
    const final_i = this.plugin.notes.length-1

    // Get the note
    const {note, now}: Note = this.plugin.notes[i]!
    const [date, time] = now.split("T")
    const formatDate = date
    const formatTime = time!.split(":").slice(0,2)

    // Note div
    const noteDiv = notesDiv.createDiv({
      cls: "note-div",
    })
    noteDiv.tabIndex = 0

    // Event listener
    noteDiv.onclick = e => {
      const target = e.target as HTMLElement;
      if (target && target.className !== "delete-button") {
        // Copy text
        navigator.clipboard.writeText(note)

        const noticeNote = `${note.slice(0,8)}${note.length > 7 ? "..." : ""}`
        // display notice
        new Notice(`"${noticeNote}" copied!`)

        // Close window
        this.close()
      }
    }
    // Event listener
    noteDiv.onkeydown = e => {
      // If going down
      if (e.key == "ArrowDown") {
        // If on the last index
        if (i == 0) {
          // Focus on button element
          const exportEl = (notesDiv.parentElement?.childNodes[2] as HTMLElement)
          exportEl.focus()
        } else {
          (notesDiv.childNodes[final_i-i+1] as HTMLElement).focus()
        } 
      }

      // If going up
      if (e.key == "ArrowUp") {
        // If on the last index
        if (i == final_i) {
          inputEl.focus()
        } else {
          (notesDiv.childNodes[final_i-(i+1)] as HTMLElement).focus()
        }
      }

      if (e.target !== deleteEl && (e.key == "ArrowLeft" || e.key == "ArrowRight")) {
        deleteEl.focus()
      }
    }

    noteDiv.addEventListener("keydown", e => {
      if (e.key == "Enter") {
        const target = e.target as HTMLElement;
        if (target && target.className !== "delete-button") {
          // Copy text
          navigator.clipboard.writeText(note)

          const noticeNote = `${note.slice(0,8)}${note.length > 7 ? "..." : ""}`
          // display notice
          new Notice(`"${noticeNote}" copied!`)

          // Close window
          this.close()
        }
      }
    })

    // Note LHS
    const noteLeftDiv = noteDiv.createDiv({
      cls: "note-left"
    })
    
    // Display the note
    const noteSpan = noteLeftDiv.createEl("p", {
      cls: "note-title"
    })
    noteSpan.createSpan({
      text: note
    })
    const timeEl = noteLeftDiv.createEl("p", {
      cls: "note-desc"
    })
    timeEl.createSpan({
      text: `${formatDate} | ${formatTime[0]}:${formatTime[1]}`
    })

    // Delete Note
    const deleteEl = noteDiv.createEl("button", {
      cls: 'delete-button',
      text: `🗑️`
    })
    deleteEl.onclick = (e) => {
      // delete
      this.plugin.deleteNote(i)

      // display notice
      const noticeNote = `${note.slice(0,8)}${note.length > 7 ? "..." : ""}`
      new Notice(`"${noticeNote}" deleted!`)

      // Close if settings say so
      if (!this.plugin.settings.persistentOnDelete) {
        this.close()
      } else {
        this.render();
      }
    }

    deleteEl.onkeydown = e => {
      if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
        noteDiv.focus()
      }
    }
  }

  onOpen(): Promise<void> | void {
    this.render()
  }
}
