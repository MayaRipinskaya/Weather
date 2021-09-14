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

fetchData(urlWether, 'GET')
    .then(res => {

        const data = JSON.parse(res)
        const [city, state, temp, tempFeelsLike, time, windDeg, windSpeed, icon] = [
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

        console.log(city, state, temp, tempFeelsLike, time, windDeg, windSpeed, icon);



        let locPOne = document.createElement('p')
        locPOne.textContent = city + ', ' + state;
        locEl.append(locPOne);

        let locPTwo = document.createElement('p')
        locPTwo.textContent = time;
        locEl.append(locPTwo);

        let iconEl = document.createElement('img');
        iconEl.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
        weatherEl.append(iconEl)
        let tempEl = document.createElement('p')
        tempEl.textContent = (Math.round(temp - 273.15)) + ' ℃';
        weatherEl.append(tempEl)
        let feelsEl = document.createElement('p')
        weatherEl.append(feelsEl)
        feelsEl.innerHTML = 'Feels like ' + (Math.round(tempFeelsLike - 273.15)) + ' ℃';
        feelsEl.style.fontSize = "1rem";

        let windIcon = document.createElement('img');
        windIcon.style.width = "1rem";
        directEl.append(windIcon);
        let windEl = document.createElement('p');

        function windDirection() {
            let direction;
            if (windDeg >= 315 || windDeg <= 45) {
                direction = 'North';
                windIcon.src = 'arrow-down_icon-icons.com_72377.svg'
            } else if (windDeg > 45 || windDeg <= 135) {
                direction = 'East';
                windIcon.src = 'arrowleft_icon-icons.com_61207.svg'
            } else if (windDeg > 135 || windDeg <= 225) {
                direction = 'South';
                windIcon.src = 'arrow-up_icon-icons.com_72374.svg'
            } else {
                direction = 'West';
                windIcon.src = 'arrow-right_icon-icons.com_72375.svg'
            }
            return direction
        };

        windEl.textContent = windDirection(windDeg);
        directEl.append(windEl);
        let speedEl = document.createElement('p');
        speedEl.textContent = (Math.round(windSpeed)) + ' m/s'
        windSpeedEl.append(speedEl)
    })

fetchData(urlWether5, 'GET')
    .then(res => {
        let days = JSON.parse(res);

        days.list.forEach((element, index) => {

            if ((index + 1) % 8 == 0) {
                var options = {
                    month: 'long'
                };
                let test = new Date(element.dt * 1000);

                let date = (test.getDate() + ' ') +
                    test.toLocaleString("ru", options);

                let nextDayEl = document.createElement('div');
                nextDayEl.classList.add("day");
                nextDayEl.innerHTML = `
                    <p> ${date}</p>
                    <img src=http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png> </img>
                    <p>${Math.round(element.main.temp- 273.15) + ' ℃'}</p>
                `
                futereEl.append(nextDayEl)
            }
        });


    })