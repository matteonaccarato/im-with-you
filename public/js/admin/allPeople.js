$(() => {
    document.querySelectorAll('.square').forEach(square => {
        console.log(square.dataset.color)
        square.style.backgroundColor = square.dataset.color
    })
})