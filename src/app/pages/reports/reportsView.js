export * from './reports';
import {PagesView} from '../pagesView';

const reports = require("./reports.hbs");
const table = require('./graph.hbs');

export class ReportView {
  constructor(root, model) {
    this._root = root;
    this._model = model;
    this.observers = [];
  }

  registerObserver(observer) {
    this.observers.push(observer)
  }

  notify() {
    this.observers.forEach(observer => observer.observe(this))
  }

  renderPage() {
    this._root.innerHTML = reports();
    this.renderGraphic()
  }

  renderGraphic(time = 1, filter = 'tasks') {
    const tableContainer = document.querySelector('#statistics');
    if (tableContainer){
      tableContainer.innerHTML = table(this._model.setValue(time, filter));
    }
  }

  getActive() {
    let active = document.querySelectorAll('.tab-list__item--active');
    return Array.from(active).map(item => item.textContent.toLowerCase())

  }

  attachListeners() {
    this._root.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('tab-list__item')) {
        const parent = evt.target.parentNode;
        parent.querySelector('.tab-list__item--active').classList.remove('tab-list__item--active');
        evt.target.classList.add('tab-list__item--active');
        this.notify()
      }
    })
  }
}
