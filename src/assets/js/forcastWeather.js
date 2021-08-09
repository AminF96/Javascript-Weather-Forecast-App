// everything related to forcast weather app
export default class ForcastWeather {
    // create url 
    _createURL(city, hours) {
        const steps = (hours / 3) + 8;

        return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${steps}&units=metric&appid=f9c72e471c0448e9ec294dcc3b628575`;
    }

    // request to weather api for forcast object
    async _requestForcastObj(url) {
        const data = await fetch(url);
        return data.json();
    }

    // calculate forcast day's start(hour 3) and end(hour 24) index in array of forcasts
    _calcDayPeriod(arr) {
        // get next 3(current) hours value
        let hours = Number(arr[0].dt_txt.slice(11, 13));
        if (hours == 0) {
            hours = 24;
        }

        // calculate next hours index in list array
        const hoursIndex = (arr.length) - 8; // this class automaticly requests for one more day and length of list array is for next days+1 and that's why we mines 8 from length of object ! to go back to next days index 

        // calculate index diffrence between current hour and last hour of day(24)
        const diffToMaxH = (24 - hours) / 3;

        // calculate index diffrence between current hour and min hour of day(3)
        const diffToMinH = (hours - 3) / 3;

        // calculate start index of day
        const startDay = hoursIndex - diffToMinH;

        // calculate end index of day
        const endDay = hoursIndex + diffToMaxH;

        return {
            startDay,
            endDay
        };
    }

    // calculate weather description in specify day
    _calcWeatherDesc(arr) {
        // get forcast day's start index and end index in arr
        const forcastDayPeriod = this._calcDayPeriod(arr);

        // keeper for all weather descriptions and Their abundance in forcast day
        let weatherAbund = {
            snow: 0,
            heavyRain: 0,
            thunder: 0,
            lightRain: 0,
            cloud: 0,
            mist: 0,
            cloudSun: 0,
            clear: 0
        };

        for (let i = forcastDayPeriod.startDay; i <= forcastDayPeriod.endDay; i++) {
            const mainDesc = arr[i].weather[0].main;
            const desc = arr[i].weather[0].description;

            // update weather abundance object base to weather description
            switch (true) {
                case (mainDesc == 'Clear'):
                    weatherAbund.clear++;
                    break;
                case (mainDesc == 'Clouds'):
                    (desc == 'few clouds') ? weatherAbund.cloudSun++: weatherAbund.cloud++;
                    break;
                case (mainDesc == 'Drizzle' || (mainDesc == 'Rain' && desc == 'light rain')):
                    weatherAbund.lightRain = weatherAbund.lightRain + 2; // special weather conditions have more priority in weather condition forcast
                    break;
                case (mainDesc == 'Rain'):
                    weatherAbund.heavyRain = weatherAbund.heavyRain + 3; // special weather conditions have more priority in weather condition forcast
                    break;
                case (mainDesc == 'Thunderstorm'):
                    weatherAbund.thunder = weatherAbund.thunder + 3; // special weather conditions have more priority in weather condition forcast
                    break;
                case (mainDesc == 'Snow'):
                    weatherAbund.snow = weatherAbund.snow + 3; // special weather conditions have more priority in weather condition forcast
                    break;
                default:
                    weatherAbund.mist = weatherAbund.mist + 3; // special weather conditions have more priority in weather condition forcast
                    break;
            }
        }

        // find The most repetitive weather condition and return it
        return Object.keys(weatherAbund)
            .find(key =>
                weatherAbund[key] === Math.max(
                    weatherAbund.clear, weatherAbund.cloudSun, weatherAbund.cloud,
                    weatherAbund.heavyRain, weatherAbund.lightRain, weatherAbund.thunder,
                    weatherAbund.snow, weatherAbund.mist
                )
            );
    }

    // calculate min and max temp in specify day
    _calcMinMaxTemp(arr) {
        // get forcast day's start index and end index in arr
        const forcastDayPeriod = this._calcDayPeriod(arr);

        // calculate min and max temp between start and end index of array (which is our forcast days period)
        let finalMinTemp = 100;
        let finalMaxTemp = -100;
        for (let i = forcastDayPeriod.startDay; i <= forcastDayPeriod.endDay; i++) {
            const minTemp = Math.floor(arr[i].main.temp_min);
            const maxTemp = Math.round(arr[i].main.temp_max);
            if (minTemp < finalMinTemp) {
                finalMinTemp = minTemp;
            }
            if (maxTemp > finalMaxTemp) {
                finalMaxTemp = maxTemp;
            }
        }

        return {
            minTemp: finalMinTemp,
            maxTemp: finalMaxTemp
        };
    }

    // create the object that can be used by app
    _getFinalObj(apiArr) {
        // get min and max temp in forcast day
        const minMMaxT = this._calcMinMaxTemp(apiArr);

        // get weather description in forcast day
        const weatherDesc = this._calcWeatherDesc(apiArr);

        // create final object for app and return it
        return {
            weatherDesc,
            minTemp: minMMaxT.minTemp,
            maxTemp: minMMaxT.maxTemp
        }
    }

    // get forcast object for next specify days(Maximum 4 days) weather condition of a city
    async getForcast(city, days) {
        if (days > 4) {
            throw new Error('days number can not be more than 4!');
        }

        // get url for request
        const url = this._createURL(city, days * 24);

        // get weather api forcast object
        const apiObj = await this._requestForcastObj(url);

        // check if user entered an invalid city 
        if (apiObj.cod == 404 || apiObj.cod == 400) {
            return null;
        }

        // // get the object that has app weather parametes
        const finalObj = this._getFinalObj(apiObj.list);

        // // creat final forcast object and return it
        return {
            city,
            minTemp: finalObj.minTemp,
            maxTemp: finalObj.maxTemp,
            weather: finalObj.weatherDesc
        }
    }
}