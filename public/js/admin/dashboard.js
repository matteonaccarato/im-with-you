const ctxUsersActive = document.getElementById('usersActivePieChart');
const userPieChart = new Chart(ctxUsersActive, {
    type: 'doughnut',
    data: {
        labels: ['Attivi (24h)', 'Totali'],
        datasets: [{
            data: [6, 10],
            backgroundColor: ['#36B8CB', '#DDDFEB'],
            hoverBackgroundColor: ['#17a673', '#858796'],
            hoverBorderColor: 'black'
        }]
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: 0
        },
        plugins: {
            legend: {
                position: 'bottom'
            }
        },
        cutout: '65%'

    }
})

const ctxGrowingChart = document.getElementById('growingChart');
const growingLine = new Chart(ctxGrowingChart, {
    type: 'line',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: 'Utenti',
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
        }]
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: 0
        },
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
})