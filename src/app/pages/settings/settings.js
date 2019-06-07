import {eventBus} from "../../EventBus";

const settings = require("./settings.hbs");
const category = require("./category.hbs");
import {Base} from '../../firebase'
import {SettingsData} from "./index";


export class Settings {
  constructor(root) {
    this._states = new SettingsData();
    this._root = root;
  }

  init(hand, obj){
    this._root.innerHTML = hand(obj)
  }

  checkMinMax() {
    let label = document.querySelectorAll('.pomodoros-form__label');
    label.forEach((item) => {
      let option = item.dataset.category;
      item.children[1].value >= this._states.data[option].max ? item.children[2].setAttribute('disabled', 'disabled') : false;
      item.children[1].value <= this._states.data[option].min ? item.children[0].setAttribute('disabled', 'disabled') : false;
    })
  }

  setValue(option, value) {
    const label = document.querySelectorAll('.pomodoros-form__label');
    label.forEach(item => {
      if (item.dataset.category === option) {
        this._states.data[option].value = value;
        item.children[1].value = value;
        this.checkMinMax(this._states);
      }
    });
  }

  checkMin(option) {
    return this._states.data[option].min
  }

  toMinutes(number) {
    let hour = number / 60, minutes = null;
    hour = Math.floor(hour);
    minutes = number - hour * 60;
    if (hour === 0) {
      return minutes + ' m '
    } else if (minutes === 0) {
      return hour + 'h '
    } else if (minutes !== 0) {
      return hour + 'h ' + minutes + ' m '
    } else {
      return hour + 'h ' + minutes + ' m '
    }
  }

  checkMax(option) {
    return this._states.data[option].max
  }

  decrease(option) {
    return this._states.data[option].value != this._states.data[option].min ? this._states.data[option].value -= this._states.data[option].step : this._states.data[option].value;
  }

  increase(option) {
    return this._states.data[option].value !== this._states.data[option].max ? this._states.data[option].value += this._states.data[option].step : this._states.data[option].value;
  }

  render() {
    var graph = document.querySelector('.graph');
    var fragment = document.createDocumentFragment();
    graph.innerHTML = '';
    var container = document.createDocumentFragment();
    var unit = 100 / ((((this._states.data.work.value * this._states.data.iteration.value) + (this._states.data.shortBreak.value * (this._states.data.iteration.value - 1))) * 2) + this._states.data.longBreak.value);
    var totalTime = (((this._states.data.work.value * this._states.data.iteration.value) + (this._states.data.shortBreak.value * (this._states.data.iteration.value - 1))) * 2) + this._states.data.longBreak.value;
    var cycleValue = (this._states.data.work.value * this._states.data.iteration.value) + (this._states.data.shortBreak.value * (this._states.data.iteration.value - 1)) + this._states.data.longBreak.value;
    var halfHour = 30, currentTime = 0;
    var timeDuration = totalTime / halfHour;
    var start = document.createElement('span');
    start.textContent = '0 m';
    start.classList.add('graph__cycle--start', 'graph__info');

    var cycle = document.createElement('span');
    cycle.textContent = 'First cycle: ' + this.toMinutes(cycleValue);
    cycle.classList.add('graph__cycle', 'graph__info');
    cycle.style.left = unit * cycleValue + "%";

    var totalCycle = document.createElement('span');
    totalCycle.textContent = this.toMinutes(totalTime);
    totalCycle.classList.add('graph__cycle--end', 'graph__info');
    totalCycle.style.right = 0 + "px";

    for (var j = 1; j <= timeDuration; j++) {
      currentTime += halfHour;

      if (currentTime !== totalTime) {
        var mark = document.createElement('span');
        mark.classList.add('graph__mark', 'graph__info');
        mark.style.left = unit * currentTime + '%';
        mark.textContent = this.toMinutes(currentTime);
        container.appendChild(mark);
      }
    }

    for (var i = 1; i <= this._states.data.iteration.value; i++) {

      var workTime = document.createElement('div');
      workTime.classList.add('graph__workTime');
      workTime.style.width = unit * this._states.data.work.value + '%';
      container.appendChild(workTime);


      if (i !== this._states.data.iteration.value) {
        var shortBreak = document.createElement('div');
        shortBreak.classList.add('graph__shortBreak');
        shortBreak.style.width = unit * this._states.data.shortBreak.value + '%';
        container.appendChild(shortBreak);
      }
    }

    var longBreak = document.createElement('div');
    longBreak.classList.add('graph__longBreak');
    longBreak.style.width = unit * this._states.data.longBreak.value + '%';

    fragment.appendChild(container.cloneNode(true));
    fragment.appendChild(longBreak);
    fragment.appendChild(container);
    graph.appendChild(fragment);
    graph.appendChild(start);
    graph.appendChild(cycle);
    graph.appendChild(totalCycle)
  }

  formAction(evt) {
    evt.preventDefault();
    const target = evt.target;
    const parent = target.parentNode;
    let category = parent.dataset.category;
    let input = target.parentNode.children[1];
    if (target.className === 'controls__minus icon-minus') {
      input.value = this.decrease(category);
      if (input.value !== this.checkMin(category)) {
        input.value == this.checkMin(category) ? parent.children[0].setAttribute('disabled', 'disabled') : parent.children[0].removeAttribute('disabled');
        parent.children[2].removeAttribute('disabled');
      }

    } else if (target.className === 'controls__plus icon-add') {
      input.value = this.increase(category);
      if (input.value !== this.checkMax(category)) {
        input.value == this.checkMax(category) ? parent.children[2].setAttribute('disabled', 'disabled') : parent.children[2].removeAttribute('disabled');
        parent.children[0].removeAttribute('disabled');
      }
    }

    this.render(this._states);
  }

  renderCategory(){
    this._root.innerHTML = category();
    const pomodoros = document.querySelector('#pomodoros').addEventListener('click', () =>{
        eventBus.publish('navigation', `/settings/`);
      })
  }

  rend(data) {
    this._states.checkPreset(data);
    this.init(settings, this._states.data);
    this.setValue();
    this.render(this._states);
    this.checkMinMax(this._states);
    let form = document.querySelector('.pomodoros-form');

    form.addEventListener('click', evt => {
      this.formAction(evt);
    });

    const goToTasks = document.querySelector(`.btn.btn--blue`).addEventListener('click', () =>{
      eventBus.publish('navigation', 'task-list')
    });

    const saveChanges = document.querySelector(`.btn.btn--green`).addEventListener('click', () =>{
      this._states.setBaseData();
      eventBus.publish('navigation', 'task-list');
      console.log('settings were save')
    });

    const category = document.querySelector('#category').addEventListener('click', () =>{
      this.renderCategory();
      eventBus.publish('navigation', `/settings/categories/`)
    });


  }
}





