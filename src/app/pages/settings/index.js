export * from './settings';
import {Base} from "../../firebase";



export class SettingsData {
  constructor() {
    this._data = {
      work: {
        min: 15,
        max: 25,
        value: 25,
        step: 5
      },
      iteration: {
        min: 2,
        max: 5,
        value: 5,
        step: 1
      },
      longBreak: {
        min: 15,
        max: 30,
        value: 30,
        step: 5
      },
      shortBreak: {
        min: 3,
        max: 5,
        value: 5,
        step: 1
      },
    };
  }

  checkPreset(data) {
    data ? this.data = data : this.setBaseData();
  }

  setBaseData() {
    Base.setData('settings', this.data);
  }

  get data() {
    return this._data
  }

  set data(data) {
    this._data = data;
  }
}

