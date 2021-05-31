$(() => {
    let lenValid = true;
    let equalsValid = true;

    const password = $('#password')
    password.on('focus', () => {
        $('#passwordErrors').removeAttr('hidden')
    })
    password.on('input blur', function(e) {
        const val = $(this).val()
        lenValid = val.length >= 8;
        equalsValid = val === $('#passwordConfirm').val();
        if (lenValid) {
            $('#wrongLen').attr('hidden', true)
            $('#validLen').removeAttr('hidden')
        } else {
            $('#wrongLen').removeAttr('hidden')
            $('#validLen').attr('hidden', true)
        }
        if (equalsValid) {
            $('#wrongEquals').attr('hidden', true)
            $('#validEquals').removeAttr('hidden')
        } else {
            $('#wrongEquals').removeAttr('hidden')
            $('#validEquals').attr('hidden', true)
        }
    })

    const passwordConfirm = $('#passwordConfirm')
    passwordConfirm.on('input blur', function(e) {
        const val = $(this).val()
        equalsValid = val === $('#password').val();
        if (equalsValid) {
            $('#wrongEquals').attr('hidden', true)
            $('#validEquals').removeAttr('hidden')
        } else {
            $('#wrongEquals').removeAttr('hidden')
            $('#validEquals').attr('hidden', true)
        }
    })


    $('#uploadForm').on('submit', e => {

        if (!($('#passwordConfirm').val() == '' && $('#passwordConfirm').val() == 0)) {
            if ((!lenValid || !equalsValid)) {
                e.preventDefault();
            }
        }

    })
})