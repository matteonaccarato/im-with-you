$(() => {
    const today = new Date();
    const month = (((today.getMonth() + 1) < 9) ? '0' : '') + (today.getMonth() + 1)
    const maxDate = `${today.getFullYear()}-${month}-${today.getDate()}`
    $('#dateOfBirth').attr('max', maxDate)
})