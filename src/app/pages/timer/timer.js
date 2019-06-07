import {TimerView} from "./timerView";
import {TimerModel} from "./timerModel";
import {eventBus} from "../../EventBus";

export class Timer {
  constructor(root) {
    this._model = new TimerModel();
    this._view = new TimerView(root, this._model);

    this.subscribeToEvents();
    this._view.registerObserver(this)
  }

  init(data) {
    this._model.data = data;
    this._model.state = 'initial';
    this._model.getEstimation();
    this._view.renderPage();
  }

  observe(event) {
    switch (event) {
      case 'pomodoro_added':
        this._model.changeEstimation();
        this._model.increaseEstimation();
        if (this._model.pomodoros.length >= 10) {
          this._view.hidePlus();
        }
        break;
      case 'change_state':
        this._model.state === "initial" ? this._view.hideHeader() : false;
        this._model.state = 'process';
        break;
      case 'state_failed':
        this._model.pomodorosStatus('failed');
        this._model.checkBrake() ? this._model.state = 'longBreak' : this._model.state = 'shortBreak';
        this._model.checkDone() ? this._model.state = 'completed' : false;
        break;
      case 'state_finished':
        this._model.pomodorosStatus('completed');
        this._model.checkBrake() ? this._model.state = 'longBreak' : this._model.state = 'shortBreak';
        if(this._model.checkDone()){
          this._view.hideHeader();
          eventBus.publish('completedTask', this._model.changeToComplete());
          this._model.state = 'completed';
        }
        break;
      case 'state_completed':
        this._view.hideHeader();
        this._model.state = 'completed';
        eventBus.publish('completedTask', this._model.changeToComplete());
        break;
    }
  }
  subscribeToEvents() {
    eventBus.subscribe('activeState', (data) => {
      this._model.task = data;
    });
  }
}
