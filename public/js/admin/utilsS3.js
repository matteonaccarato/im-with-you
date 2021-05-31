$('#uploadForm').on('submit', () => {
    $("#status").empty().text("Loading ...");
});

const checkFile = fileToLoad => {
    const file = fileToLoad.files[0]
    console.log(file)

    let valido = true;
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        alert('File non supportato!')
        valido = false;
    }

    if (file.size > 1024 * 1024 * 10) {
        alert('Il file non deve superare i 10 MB');
        valido = false;
    }

    if (valido) {
        $('#deleteImage').val('1')
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

const deleteSavedImage = (els) => {
    els.forEach(el => {
        $(`#${el}`).attr('hidden', true)
    })

    $('#deleteImage').val('1')
}

const deleteImage = () => {
    $("#image").val('');
    $('#imagePreview').attr('hidden', true)
    $('#btnDeleteImage').attr('hidden', true)
}