$(() => {
    const today = new Date();
    const month = (((today.getMonth() + 1) < 9) ? '0' : '') + (today.getMonth() + 1)
    const maxDate = `${today.getFullYear()}-${month}-${today.getDate()}`
    console.log(month)
    $('#dateOfBirth').attr('max', maxDate)
})