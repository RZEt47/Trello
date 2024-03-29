

const Application = {

    save() {

        const columnElement =  document.querySelectorAll('.column')
        const noteElement = document.querySelectorAll('.note')

        const object = {
            columns: {
                idCounter: Column.idCounter,
                items: []
            },
            notes: {
                idCounter: Note.idCounter,
                items: []
            }
        }

        columnElement.forEach(function (columnElement) {

            const column = {
                columnHeader: columnElement.querySelector('.column-header').innerText,
                id: parseInt(columnElement.getAttribute('data-column-id')),
                noteIds: []
            }

            columnElement.querySelectorAll('.note').forEach(function (noteElement) {
                column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')))
            })

            object.columns.items.push(column)
        })

        noteElement.forEach(function (noteElement) {

            const note = {
                id: parseInt(noteElement.getAttribute('data-note-id')),
                content: noteElement.textContent
            }

            object.notes.items.push(note)
        })

        const json = JSON.stringify(object)
        localStorage.setItem('trello', json)
    },


    load() {

        if(!localStorage.getItem('trello')) {
            return
        }

        const mountPoint = document.querySelector('.columns')
        mountPoint.innerHTML = ''

        const object = JSON.parse(localStorage.getItem('trello'))
        const getNoteById = id => object.notes.items.find(note => note.id === id)

        for (const {id, noteIds, columnHeader} of object.columns.items) {

            const column = new Column (id, columnHeader)
            mountPoint.append(column.element)

            for (const noteId of noteIds) {

                const {id, content} = getNoteById(noteId)
                const note = new Note(id, content)

                column.add(note.element)
            }

        }

        del()
    }
}

