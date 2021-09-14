const key = '03fb54ebf904aeecf7fbb0e169f0c7ad';
const urlWether = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`;
const urlWether5 = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`;

const locEl = document.querySelector('.location');
const weatherEl = document.querySelector('.weather');
const directEl = document.querySelector('.direction');
const windSpeedEl = document.querySelector('.speed');
const futereEl = document.querySelector('.future')


function fetchData(url, method) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onload = () => {
            if (xhr.status == '200') {
                resolve(xhr.response);
            } else {
                reject(new Error('Error: ' + xhr.status + ' ' + xhr.statusText));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Error: ' + xhr.status + ' ' + xhr.statusText));
        };

        xhr.send();
    });

    return promise;
};

class ThisDay {
    constructor(response) {
        let data = JSON.parse(response);
        [this.city, this.state, this.temp, this.tempFeelsLike, this.time, this.windDeg, this.windSpeed, this.icon] = [
            data.name,
            data.sys.country,
            data.main.temp,
            data.main.feels_like,
            new Date(data.dt * 1000).getHours() + ':' + new Date(data.dt * 1000)
            .getMinutes(),
            data.wind.deg,
            data.wind.speed,
            data.weather[0].icon
        ]
        this.showInfo()
    }
    createP(content, container) {
        let locPOne = document.createElement('p');
        locPOne.textContent = content;
        container.append(locPOne);
    }

    showInfo() {
        this.createP(this.city + ', ' + this.state, locEl);

        this.createP(this.time, locEl);

        let iconEl = document.createElement('img');
        iconEl.src = `http://openweathermap.org/img/wn/${this.icon}@2x.png`
        weatherEl.append(iconEl)
        let tempEl = document.createElement('p')
        tempEl.textContent = (Math.round(this.temp - 273.15)) + ' ℃';
        weatherEl.append(tempEl)
        let feelsEl = document.createElement('p')
        weatherEl.append(feelsEl)
        feelsEl.innerHTML = 'Feels like ' + (Math.round(this.tempFeelsLike - 273.15)) + ' ℃';
        feelsEl.style.fontSize = "1rem";

        let speedEl = document.createElement('p');
        speedEl.textContent = (Math.round(this.windSpeed)) + ' m/s'
        windSpeedEl.append(speedEl)

        let windEl = document.createElement('p');
        windEl.textContent = this.windDirection(this.windDeg);
        directEl.append(windEl);
    }
    windDirection() {

        let windIcon = document.createElement('img');
        windIcon.style.width = "1rem";
        directEl.append(windIcon);
        let direction;
        if (this.windDeg >= 315 || this.windDeg <= 45) {
            direction = 'North';
            windIcon.src = 'arrow-down_icon-icons.com_72377.svg'
        } else if (this.windDeg > 45 || this.windDeg <= 135) {
            direction = 'East';
            windIcon.src = 'arrowleft_icon-icons.com_61207.svg'
        } else if (this.windDeg > 135 || this.windDeg <= 225) {
            direction = 'South';
            windIcon.src = 'arrow-up_icon-icons.com_72374.svg'
        } else {
            direction = 'West';
            windIcon.src = 'arrow-right_icon-icons.com_72375.svg'
        }
        return direction
    };
}

fetchData(urlWether, 'GET')
    .then((response) => {

        new ThisDay(response)
    })

class NextDays {
    constructor(response) {
        let days = JSON.parse(response);
        days.list.forEach((element, index) => {

            if ((index + 1) % 8 == 0) {
                var options = {
                    month: 'long'
                };
                this.test = new Date(element.dt * 1000);

                this.date = (this.test.getDate() + ' ') +
                    this.test.toLocaleString("ru", options);

                let nextDayEl = document.createElement('div');
                nextDayEl.classList.add("day");
                nextDayEl.innerHTML = `
                    <p> ${this.date}</p>
                    <img src=http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png> </img>
                    <p>${Math.round(element.main.temp- 273.15) + ' ℃'}</p>
                `
                futereEl.append(nextDayEl)
            }
        });
    }
}


fetchData(urlWether5, 'GET')
    .then(response => {
        new NextDays(response)
    })