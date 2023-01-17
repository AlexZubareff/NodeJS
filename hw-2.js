const colors = require("colors/safe");
const EventEmitter = require('events');


class MyEmitter extends EventEmitter { };
const timerEmitter = new MyEmitter();


function getTimeRemaining(deadline) {
    let t = deadline - Date.parse(new Date());

    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    let days = Math.floor(t / (1000 * 60 * 60 * 24) % 30);
    let months = Math.floor(t / (1000 * 60 * 60 * 24 * 30) % 12);
    let years = Math.floor(t / (1000 * 60 * 60 * 24 * 30 * 12));
    return {
        'total': t,
        'years': years,
        'months': months,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

//функция создания таймера с датами окончания из массива endDateArr
function timer(endDateArr) {

    endDateArr.forEach((data, index) => {
        let timerName = `Timer-${index + 1}`;
        let hour = data.slice(0, 2);
        let day = data.slice(3, 5);
        let month = data.slice(6, 7);
        let year = data.slice(8, 12);
        let enterDate = new Date(year, month - 1, day, hour);
        let deadline = Date.parse(enterDate);
        // console.log(enterDate);
        // console.log(deadline);

        let now = new Date();
        if (deadline <= now) {
            timerEmitter.emit('end', `${timerName}: Таймер завершён`);
        } else {
            let timeinterval = setInterval(function () {
                let t = getTimeRemaining(deadline);
                console.log(timerName, ':', t.years, ':', t.months, ':', t.days, ':', t.hours, ':', t.minutes, ':', t.seconds);
                if (t.total < 1000) {
                    clearInterval(timeinterval);
                    timerEmitter.emit('end', `${timerName}: Таймер завершён`);
                }
            }, 1000);
        }
    });
}

// получаем массив аргументов(дат) из консоли
let endDateArr = [];
process.argv.forEach((val, index) => {
    if (index >= 2) {
        endDateArr.push(val);
    }
});

// слушатель события START
timerEmitter.on('start', function (endDateArr) {
    timer(endDateArr);
});

// слушатель события END
timerEmitter.on('end', function (text) {
    process.stdout.write(colors.red(`${text}` + "\n"))
});

// эмиттер события START
timerEmitter.emit('start', endDateArr);
