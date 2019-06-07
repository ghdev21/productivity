import {eventBus} from "../../EventBus";
export * from './timer';
const taskListTemp = require("./timer.hbs");

export class TimerView {
  constructor(root, model) {
    this._root = root;
    this._model = model;
    this.observers = []
  }

  navigate(page){
    eventBus.publish('navigation', page);
  }

  registerObserver(observer) {
    this.observers.push(observer)
  }

  notify(channel) {
    this.observers.forEach(observer => observer.observe(channel, this))
  }

  renderPage(temp = taskListTemp) {
    this._root.innerHTML = temp(this._model.createData());
    this.attachListeners();
  }

  addPomodoro(evt) {
    if (this._model.task.estimation < 10) {
      this.notify('pomodoro_added');
      this.changeEstimation(evt);
    }
  }

  hideHeader(){
    const header = document.querySelector('.header');
    header.classList.toggle('none');
  }

  hidePlus() {
    const addPomodoro = document.querySelector('.icon--estimation');
    addPomodoro.style.display = 'none';
  }

  stateToggle(event) {
    this.notify(event);
    this.renderPage()
  }

  changeEstimation(evt) {
    const plus = evt.target.parentNode;
    const elem = document.createElement("li");
    elem.classList.add('complexity__item');
    elem.innerHTML = ` <img src="/images/empty-tomato.svg" class="complexity__icon" alt="tomato">`;
    plus.insertAdjacentElement('beforebegin', elem);
  };

  attachListeners() {
    const start = document.querySelector('#start');
    const startPomodoro = document.querySelector('#startPomodora');
    const addPomodoro = document.querySelector('.icon--estimation');
    const fail = document.querySelector('#fail');
    const finishPomodora = document.querySelector('#finishPomodora');
    const doneTask = document.querySelector('#finish');
    const toTaskList = document.querySelector('#toTask');
    const toReports = document.querySelector('#toReports');

    start ? start.addEventListener('click', () => this.stateToggle('change_state')) : false;
    addPomodoro ? addPomodoro.addEventListener('click', (evt) => this.addPomodoro(evt)) : false;
    fail ? fail.addEventListener('click', () => this.stateToggle('state_failed')) : false;
    finishPomodora ? finishPomodora.addEventListener('click', () => this.stateToggle('state_finished')) : false;
    startPomodoro ? startPomodoro.addEventListener('click', () => this.stateToggle('change_state')) : false;
    doneTask ? doneTask.addEventListener('click', () => this.stateToggle('state_completed')) : false;
    toTaskList ? toTaskList.addEventListener('click', () => this.navigate('task-list')) : false ;
    toReports ? toReports.addEventListener('click', () => this.navigate('reports')) : false ;
  }
}
