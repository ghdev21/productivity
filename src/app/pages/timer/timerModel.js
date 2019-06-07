export class TimerModel {
  constructor() {
    this._data = null;
    this._task = null;
    this.state = 'initial';
    this.pomodoros = [];
  }

  createData() {
    return {
      state: this.state,
      task: this.task,
      setting: this.data,
      pomodoros: this.pomodoros,
    }
  }

  findEmptyPomodoros() {
    return this.pomodoros.findIndex(item => item === '');
  }

  pomodorosStatus(status) {
    const index = this.findEmptyPomodoros();
    this.pomodoros[index] = status;
  }

  changeEstimation() {
    this.task.estimation <= 10 ? this.task.estimation++ : false;
  }

  getEstimation() {
    this.pomodoros.length = 0;
    for (let i = 0; i < this.task.estimation; i++) {
      this.pomodoros.push('')
    }
  }

  increaseEstimation() {
    this.pomodoros.push('')
  }

  changeToComplete() {
    this.task.status = 'COMPLETED';
    this.task.completeDate = new Date();
    this.pomodoros.forEach(item => item === 'completed' ? this.task.completedCount++ : false);
    this.pomodoros.forEach(item => item === 'failed' ? this.task.failedPomodoros++ : false);
    return this.task
  }

  checkBrake() {
    const pos = this.findEmptyPomodoros();
    const iteration = this.data.iteration.value;
    return pos !== 0 && pos % iteration === 0;
  }

  checkDone() {
    return this.findEmptyPomodoros() === -1
  }

  get task() {
    return this._task
  }

  set task(item) {
    this._task = item
  }

  set data(data) {
    this._data = data
  }

  get data() {
    return this._data
  }
}
