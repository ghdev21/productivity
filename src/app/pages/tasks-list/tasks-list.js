require('./tasks-list.less');
import {TaskListView} from "./taskList-View";
import {TaskListModel} from "./taskList-Model";
import {eventBus} from "../../EventBus";

export class TaskList {
  constructor(root) {
    this._model = new TaskListModel();
    this._view = new TaskListView(root, this._model);

    this.handleBasketClick = this.handleBasketClick.bind(this);
  }

  destroy() {
    this._view.detachListeners();
  }

  initData(data) {
    this._model.setData(data);
    this.init();
  }

  init() {
    if (this.isInitialized) {
      this.destroy();
    }
    this._model.changeStatus()
    if (!sessionStorage.getItem('newUser')) {
      this._view.showMessage();
      this._model.data = [];
      eventBus.publish('dataChange', this._model.data);
    } else if (sessionStorage.getItem('newUser') === 'firstVisit') {
      this._view.firstTask();
    } else {
      this._view.renderPage();
    }
    this.subscribeToEvents();
    this._view.attachListeners();
    this.isInitialized = true;
  }

  handleBasketClick(evt) {
    evt.target.classList.toggle('deleted');

    if (evt.target.classList.contains('deleted')) {
      this._model.bool = true;
      this.init();

    } else {
      this._view.deleteItem();
    }

  }

  deleteTasks(data) {
    this._model.deleteItem(data);
    this._model.bool = false;
    this.init();
  }

  subscribeToEvents() {
    eventBus.subscribe('save', (obj) => {
      sessionStorage.setItem('newUser', 'true');
      this._model.changeItem(obj);
      this._view.renderPage();
      this._view.attachListeners();
    });

    eventBus.subscribe('basket', (evt) => {
      this.handleBasketClick(evt);
    });

    eventBus.subscribe('approveDelete', data => {
      this.deleteTasks(data);
    });

    eventBus.subscribe('cancelDelete', () => {
      this._model.bool = false;
      this.init();
    });

    eventBus.subscribe('singleDelete', data => {
      let arr = [];
      arr.push(data);
      this._model.deleteItem(arr);
      this._view.removeModal();
      this.init()
    });

    eventBus.subscribe('hideGreet', () => {
      sessionStorage.setItem('newUser', 'firstVisit');
      this._view.firstTask();
      this._view.attachListeners();
    });
  }
}






