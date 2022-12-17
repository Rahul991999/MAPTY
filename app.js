'use Strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// using navigator.geolocation API

let objec;
let map;


class Workout {
    constructor(distance, duration, coords) {
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;
        this.date = new Date();
        this.id = (Date.now() + "");
    }
}

class Running extends Workout {
    constructor(distance, duration, coords, cadence) {
        super(distance, duration, coords);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        this.pace = this.duration / this.distance;
        //    return this.pace;
    }
}

class Cycling extends Workout {
    constructor(distance, duration, coords, elevationGain) {
        super(distance, duration, coords);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        // return this.Speed;
    }
}

const cyc1 = new Cycling(12, 30, [12, -16], 34);
const run1 = new Running(15, 12, [12, -16], 340);


class App {
    #objec
    #map;
    #coords;
    #workouts = [];
    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
    }
    _getPosition() {
        if (navigator.geolocation) {
            // console.log(this);
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
                function () {
                    alert(`unable to get your location`);
                });
        }
    }
    _loadMap(position) {
        // console.log(this);
        const { latitude, longitude } = position.coords;
        this.#coords = [latitude, longitude];

        this.#map = L.map('map').setView(this.#coords, 13);  // in map function we have to mention id name of html element in which we are going to display our map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        // L.marker(coords).addTo(this.#map)
        //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        //     .openPopup();
        this.#map.on('click', this._showForm.bind(this));
    }
    _showForm(obj) {
        this.#objec = obj;
        // console.log(this.#objec);
        // console.log(this);
        form.classList.remove('hidden');
    }
    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }
    _newWorkout(e) {
        e.preventDefault();
        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);

        if (type === 'running') {
            const cadence = Number(inputCadence.value);
            if (!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence)) {
                return alert(`invalid data`)
            }
            this.#workouts.push(new Running(distance, duration, this.#coords, cadence));
        }
        if (type === 'cycling') {
            const elevation = inputElevation.value;
            if (!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(elevation)) {
                return alert(`invalid data`)
            }
            this.#workouts.push(new Cycling(distance, duration, this.#coords, elevation));
        }
        console.log(this);
        this._renderWorkout.bind(this);
        console.log("hello world");
    }
    _renderWorkout(){
        console.log(this);
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        inputDistance.focus();
        inputDuration.blur();
        inputCadence.blur();
        inputElevation.blur();
        // console.log(this);
        const { lat } = this.#objec.latlng;
        const { lng } = this.#objec.latlng;
        const arr = [lat, lng];
        // console.log(lat,lng);
        L.marker(arr).addTo(this.#map)
            .bindPopup(L.popup({
                autoClose: false,
                closeOnClick: false,
                className: `${type}-popup`,
            })).setPopupContent(`WORKOUT`)
            .openPopup();

        form.insertAdjacentHTML("beforeend",` <li class="workout workout--running" data-id="1234567890">
        <h2 class="workout__title">Running on April 14</h2>
        <div class="workout__details">
          <span class="workout__icon">🏃‍♂️</span>
          <span class="workout__value">5.2</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">24</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">4.6</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">178</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>`)
    }
}

const app = new App();
// console.log(app);


