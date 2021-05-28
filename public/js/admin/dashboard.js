const ctxUsersActive = document.getElementById('usersActivePieChart');
const nUsers = document.getElementById('chart-dataUsersActiveToday').dataset.nusers;
const nUsersActiveToday = document.getElementById('chart-dataUsersActiveToday').dataset.nusersactive;

const usersPieChart = new Chart(ctxUsersActive, {
    type: 'doughnut',
    data: {
        labels: ['Attivi (oggi)', 'Non attivi'],
        datasets: [{
            data: [nUsersActiveToday, nUsers - nUsersActiveToday],
            backgroundColor: ['#66FF66', '#DDDFEB'],
            hoverBackgroundColor: ['#33FF33', '#858796'],
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