/* let statusSwitch = document.getElementById('statusSwitch')
if (statusSwitch.dataset.status == 1) {
    const attr = document.createAttribute("checked")
    statusSwitch.setAttributeNode(attr)
} */

/* const checkFile = fileToLoad => {
    const file = fileToLoad.files[0]
    console.log(file)

    let valido = true;
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        alert('File non supportato!')
        valido = false;
    }

    if (file.size > 1024 * 1024 * 5) {
        alert('Il file non deve superare i 5 MB');
        valido = false;
    }

    if (valido) {
        $('#oldImg').attr('hidden', true)
        $('#trashOldImg').attr('hidden', true)
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#imagePreview').attr('src', e.target.result);
        }
        reader.readAsDataURL(file)

        $('#imagePreview').removeAttr('hidden')
        $('#btnDeleteImage').removeAttr('hidden')
    }
}

const deleteImage = () => {
    $("#image").val('');
    $('#imagePreview').attr('hidden', true)
    $('#btnDeleteImage').attr('hidden', true)
} */