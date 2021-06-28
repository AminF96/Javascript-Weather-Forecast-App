// everyhing related to UI
class UI {
    // empty an element
    emptyElement(elem) {
        elem.innerHTML = '';
    }

    // hide an element
    hideElement(elem) {
        elem.classList.add('d-none');
    }

    // show an element
    showElement(elem) {
        if (elem.classList.contains('d-none')) {
            elem.classList.remove('d-none');
        }
    }

    // show a message 
    showMessage(text, className) {
        // check if meesage element is already exists
        if (document.querySelector('#message')) {
            this._removeMessageByDellay(0);
        }

        // create message element
        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = `
        <i class="fas fa-exclamation"></i> ${text}`;
        div.id = 'message';

        // show message
        document.querySelector('.result-wrapper').appendChild(div);

        // remove message after 5s
        this._removeMessageByDellay(5000);
    }

    // remove message after dellay
    _removeMessageByDellay(dellay) {
        setTimeout(() => {
            const message = document.querySelector('#message')
            if (message) {
                message.remove();
            }
        }, dellay);
    }


    // determine weather ico base to weather name in city info object
    _getWeatherIcon(weather) {
        let icon;
        switch (weather) {
            case 'clear':
                icon = `<i class="fas fa-sun" style="color:#FFCC33;"></i>`;
                break;
            case 'cloudSun':
                icon = `<i class="fas fa-cloud-sun" style="color:#FFE484;"></i>`;
                break;
            case 'cloud':
                icon = `<i class="fas fa-cloud" style="color:#d0cccc;"></i>`;
                break;
            case 'lightRain':
                icon = `<i class="fas fa-cloud-rain" style="color:#92BAD2;"></i>`;
                break;
            case 'heavyRain':
                icon = `<i class="fas fa-cloud-showers-heavy" style="color:#53789E;"></i>`;
                break;
            case 'thunder':
                icon = `<i class="fas fa-bolt" style="color:#001C3D;"></i>`;
                break;
            case 'snow':
                icon = `<i class="far fa-snowflake" style="color:#74A4C7;"></i>`;
                break;
            case 'mist':
                icon = `<i class="fas fa-smog" style="color:#769695;"></i>`;
                break;
            default:
                break;
        }

        return icon;
    }

    // update cities weather forcast wrapper 
    showCityForcast(wrapper, cityInfo) {
        // crate card element for show info in it
        let card = document.createElement('div');
        card.className = 'card border-0 shadow py-2 text-center mx-auto mt-4';

        // get icon svg element based on cityInfo's weather name
        const icon = this._getWeatherIcon(cityInfo.weather);

        card.innerHTML = `
            <div class="icon pt-4">
                ${icon}
            </div>
            <div class="card-body">
                <h3 class="card-title text-dark">${cityInfo.city}</h3>
                <div class="temp d-flex justify-content-around">
                    <span class="text-primary">
                        <i class="fas fa-temperature-low"></i> ${cityInfo.minTemp}
                    </span>
                    <span class="text-danger">
                        <i class="fas fa-temperature-high"></i> ${cityInfo.maxTemp}
                    </span>
                </div>
            </div>
        `;

        wrapper.appendChild(card);
    }
}