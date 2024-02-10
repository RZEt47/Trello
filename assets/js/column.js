
class Column {
    constructor(id = null, columnHeader) {

        const instance = this
        this.notes = []
        const element = this.element = document.createElement('div')

        element.classList.add('column')
        element.setAttribute('draggable', 'true')

        if(id) {
            element.setAttribute('data-column-id', id)
        } else {
            element.setAttribute('data-column-id', Column.idCounter)
            Column.idCounter++
        }

        if (columnHeader) {
            element.innerHTML = `<p class="column-header">${columnHeader}</p>
                            <div data-notes></div>
                            <p class="column-footer">
                                <span data-action-addNote class="action">+ Добавить карточку</span>
                            </p>
                                <div class="close-container">
                                  <div class="leftright"></div>
                                  <div class="rightleft"></div>
                                </div>`
        } else {
            element.innerHTML = `<p class="column-header">В плане</p>
                            <div data-notes></div>
                            <p class="column-footer">
                                <span data-action-addNote class="action">+ Добавить карточку</span>
                            </p>
                                <div class="close-container">
                                  <div class="leftright"></div>
                                  <div class="rightleft"></div>
                                </div>`
        }


        const spanActionAddNote = element.querySelector('[data-action-addNote]')

        spanActionAddNote.addEventListener('click', function () {

            const note = new Note
            instance.add(note.element)

            note.element.setAttribute('contenteditable', 'true')
            note.element.focus()
        })

        this.editHeader(element)


        element.addEventListener('dragstart', this.dragStart.bind(this))
        element.addEventListener('dragend', this.dragEnd.bind(this))
        element.addEventListener('dragover', this.dragOver.bind(this))
        element.addEventListener('drop', this.drop.bind(this))

    }

    add(...notes) {
        for(const note of notes) {
            if (!this.notes.includes(note)) {
                this.notes.push(note)

                this.element.querySelector('[data-notes]').append(note)
            }
        }
    }

    editHeader(element) {

        const headerNote = element.querySelector('.column-header')

        headerNote.addEventListener('dblclick', function () {
            headerNote.setAttribute('contenteditable', 'true')
            headerNote.focus()
        })

        headerNote.addEventListener('blur', function () {
            headerNote.removeAttribute('contenteditable')
            Application.save()
        })
    }


    dragStart(e) {

        Column.dragged = this.element
        Column.dragged.classList.add('dragged')
        e.stopPropagation()

        document.querySelectorAll('.note').forEach(function (noteElement) {
            noteElement.removeAttribute('draggable')
        })
    }

    dragEnd(e) {

        e.stopPropagation()
        Column.dragged.classList.remove('dragged')
        Column.dragged = null
        Column.dropped = null

        document.querySelectorAll('.note').forEach(function (noteElement) {
            noteElement.setAttribute('draggable', 'true')
        })

        document.querySelectorAll('.column').forEach(function (columnElement){
            columnElement.classList.remove('under')
        })

        Application.save()
    }

    dragOver(e) {

        e.preventDefault()
        e.stopPropagation()

        if(Column.dragged === this.element) {
            if(Column.dropped) {
                Column.dropped.classList.remove('under')
            }
            Column.dropped = null
        }

        if (!Column.dragged || Column.dragged === this.element) {
            return
        }

        Column.dropped = this.element

        document.querySelectorAll('.column').forEach(function (noteElement) {
            noteElement.classList.remove('under')
        })

        this.element.classList.add('under')
    }

    drop() {

        if (Note.dragged) {
            return this.element.querySelector('[data-notes]').append(Note.dragged)
        } else if (Column.dragged) {
            const children = Array.from(document.querySelector('.columns').children)
            const indexThis = children.indexOf(this.element)
            const indexDrag = children.indexOf(Column.dragged)

            if (indexThis < indexDrag) {
                document.querySelector('.columns').insertBefore(Column.dragged, this.element)
            } else {
                document.querySelector('.columns').insertBefore(Column.dragged, this.element.nextElementSibling)
            }

            document.querySelectorAll('.column').forEach(function (noteElement) {
                noteElement.classList.remove('under')
            })
        }
    }
}

Column.idCounter = 1
Column.dragged = null
Column.dropped = null

