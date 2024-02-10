
class Note {
    constructor(id = null, content = '') {

        const instance = this
        const element = this.element = document.createElement('div')

        element.classList.add('note')
        element.setAttribute('draggable', 'true')
        element.textContent = content

        if(id) {
            element.setAttribute('data-note-id', id)
        } else {
            element.setAttribute('data-note-id', Note.idCounter)
            Note.idCounter++
        }

        element.addEventListener('dblclick', function () {
            element.setAttribute('contenteditable', 'true')
            element.removeAttribute('draggable')
            instance.column.removeAttribute('draggable')
            element.focus()
        })

        element.addEventListener('blur', function () {
            element.removeAttribute('contenteditable')
            element.setAttribute('draggable', 'true')
            instance.column.setAttribute('draggable', 'true')

            if (!element.textContent.trim().length) {
                element.remove()
            }

            Application.save()
        })

        element.addEventListener('dragstart', this.dragStart.bind(this))
        element.addEventListener('dragend', this.dragEnd.bind(this))
        element.addEventListener('dragenter', this.dragEnter.bind(this))
        element.addEventListener('dragover', this.dragOver.bind(this))
        element.addEventListener('dragleave', this.dragLeave.bind(this))
        element.addEventListener('drop', this.drop.bind(this))

    }

    get column() {
        return this.element.closest('.column')
    }

    dragStart(e) {

        e.stopPropagation()

        Note.dragged = this.element

        this.element.classList.add('dragged')
    }
    dragEnd(e) {

        Note.dragged = null

        this.element.classList.remove('dragged')

        document.querySelectorAll('.note').forEach(function (item){
            item.classList.remove('under')
        })

        Application.save()
        e.stopPropagation()
    }
    dragEnter() {

        if (!Note.dragged || this.element === Note.dragged) {
            return
        }

        this.element.classList.add('under')
    }
    dragOver(e) {

        e.preventDefault()
        e.stopPropagation()

        if (!Note.dragged || this.element === Note.dragged) {
            return
        }
    }
    dragLeave() {

        if (!Note.dragged || this.element === Note.dragged) {
            return
        }

        this.element.classList.remove('under')
    }
    drop(e) {

        e.stopPropagation()

        if (!Note.dragged || this.element === Note.dragged) {
            return
        }

        if (this.element.parentElement === Note.dragged.parentElement) {

            const note = Array.from(this.element.parentElement.querySelectorAll('.note'))
            const indexThis = note.indexOf(this)
            const indexDrag = note.indexOf(Note.dragged)

            if (indexThis < indexDrag) {
                this.element.parentElement.insertBefore(Note.dragged, this.element)
            } else {
                this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling)
            }

        } else {
            this.element.parentElement.insertBefore(Note.dragged, this.element)
        }
    }
}

Note.idCounter = 8
Note.dragged = null



