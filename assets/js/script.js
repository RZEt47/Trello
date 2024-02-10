

Application.load()


// Add new column
document.querySelector('[data-action-addColumn]').addEventListener('click', function () {

    const column = new Column
    document.querySelector('.columns').append(column.element)

    del()
    Application.save()
})


// Remove column
function del() {
    document.querySelectorAll('.close-container').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.target.closest('.column').remove()
            Application.save()
        })
    })
}





