import {eventBus} from "../../EventBus";

require('./reports.less');
import {ReportView} from "./reportsView";
import {ReportModel} from "./ReportModel";

export class Reports {
  constructor(root) {
    this._model = new ReportModel();
    this._view = new ReportView(root, this._model);

    this._view.registerObserver(this)
  }

  init(data) {
    this._model.data = data;
    this._model.setValue();
    this._view.renderPage();
    this._view.attachListeners();
  }

  observe(){
    const [time, filter] = this._view.getActive();
    let data = {day: 1, week: 7, month: 30, tasks: 'tasks', pomodoros: 'pomodoros'};
    this._view.renderGraphic(data[time], data[filter]);
    eventBus.publish('navigation', `reports/${time}/${filter}`)


  }

}
