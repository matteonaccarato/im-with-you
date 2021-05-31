$(() => {
    const status = document.getElementById('statusSwitch').dataset.status
    if (status == 1) {
        $('#statusSwitch').attr('checked', true)
    }
})