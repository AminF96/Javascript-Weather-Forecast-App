'use strict';
// constants & variables
const form = document.querySelector('#form');
const cityInput = document.querySelector('#city');
const forcastDayInput = document.querySelector('#days');
const resultWrapper = document.querySelector('#result');
const loading = document.querySelector('#loading');

// clasess
const ui = new UI;
const forcast = new ForcastWeather;

// eventListeners
eventListeners();

function eventListeners() {
    // when submit happens on form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // empty result wrapper (if there was any forcast info in it)
        ui.emptyElement(resultWrapper);

        // show loading spinner
        ui.showElement(loading);

        // get city forcast information from api
        const forcastInfo = await forcast.getForcast(cityInput.value, forcastDayInput.value);

        // hide loading spinner
        ui.hideElement(loading);

        // check if city name was invalid or city information was not exists in api database
        if (!forcastInfo) {
            ui.emptyElement(resultWrapper);
            ui.showMessage('متاسفانه برای شهر مدنظرتان اطلاعاتی در دسترس نیست. لطفا نام شهر دیگری را وارد کنید', 'alert alert-danger text-center');
            return;
        }

        // show city weather forcast in HTML
        ui.showCityForcast(resultWrapper, forcastInfo);
    });
}