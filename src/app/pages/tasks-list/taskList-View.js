import {eventBus} from "../../EventBus";

const taskListTemp = require("./templates/task-list.hbs");
const message = require('./templates/message-greet.hbs');
const firstVisit = require('./templates/firstTask.hbs');

export class TaskListView {
  constructor(root, model) {
    this._root = root;
    this._model = model;
  }

  init(template, source) {
    if (source) {
      this._root.innerHTML = template(source);
    } else {
      this._root.innerHTML = template();
    }
  }

  renderPage(data = this._model.sortArr().toDo) {
    this.init(taskListTemp, data);
  }

  showMessage() {
    this.init(message);
  }

  globalVisibility(evt, global) {
    if (evt.target.classList.contains('tasks__link')) {
      let toggle = global.children[0].children[0];
      let category = global.children[0].children[1];
      toggle.children[0].classList.toggle('icon-global-list-arrow-right');
      let globalBlock = global.querySelectorAll('.global');
      category.classList.toggle('none');
      globalBlock.forEach(item => item.classList.toggle('none'));
    }
  }

  addActiveState(evt) {
    let filterPriority = document.querySelectorAll('.priority');
    filterPriority.forEach(item => item.classList.remove('tab-list__item--active'));
    let id = evt.dataset.pos;
    filterPriority[id].classList.toggle('tab-list__item--active');
  }

  checkDelete(evt) {
    let category = evt.target.dataset.category;
    if (evt.target.classList.contains('icon-trash')) {
      evt.target.classList.toggle(`task-list__delete--${category}_active`);
      evt.target.classList.toggle('deleted');
    }
    if (evt.target.classList.contains('selectAll')) {
      let sibling = evt.target.parentElement.nextSibling.nextSibling;
      sibling.querySelectorAll(`.task-list__delete`).forEach(item => {
        item.classList.add(`task-list__delete--${item.dataset.category}_active`, `deleted`)
      })
    } else if (evt.target.classList.contains('deselectAll')) {
      let sibling = evt.target.parentElement.nextSibling.nextSibling;
      sibling.querySelectorAll(`.task-list__delete`).forEach(item => {
        item.classList.remove(`task-list__delete--${item.dataset.category}_active`, `deleted`)
      })
    }
    this.countDelete();
  }

  countDelete() {
    let buttons = document.querySelectorAll('.task-list__delete');
    let counter = 0;
    buttons.forEach(item => {
      if (item.classList.contains('deleted')) {
        counter++
      }
    });
    let trash = document.querySelector('.menu__item');
    if (counter > 0) {
      trash.classList.add('basket');
      trash.dataset.quantity = counter;

    } else {
      trash.classList.remove('basket')
    }
  }

  addActiveStatus(evt) {
    let filterPriority = document.querySelectorAll('.tasks .tab-list__item');
    filterPriority.forEach(item => item.classList.remove('tab-list__item--active'));
    let id = evt.dataset.pos;
    filterPriority[id].classList.toggle('tab-list__item--active')
  }

  deleteItem() {

    let basket = document.querySelector('.menu__item');
    let buttons = document.querySelectorAll('.task-list__delete');
    const deleted = [];
    buttons.forEach((item) => {
      if (item.classList.contains('deleted')) {
        deleted.push(item.parentNode.dataset.id)
      }
    });

    if (deleted.length >= 1) {
      this.createModal();
      let approve = document.querySelector('.btn.btn--red').addEventListener('click', () => {
        eventBus.publish('approveDelete', deleted);
        this.removeModal();
        basket.classList.remove('basket');
      });
      let trash = document.querySelector('.icon-close').addEventListener('click', () => {
        this.removeModal();
      });

      let deni = document.querySelector('.btn.btn--blue').addEventListener('click', () => {
        this.removeModal();
        eventBus.publish('cancelDelete');
        basket.classList.remove('basket');
      })
    } else {
      eventBus.publish('cancelDelete');
    }
  }

  createModal() {
    let modalDelete = document.createElement('div');
    modalDelete.innerHTML = `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal__buttons button-control">
            <button class="button-control__icon button-control__icon--close icon-close"></button>
          </div>
          <h2 class="modal__title">Remove Task</h2>
          <p class="modal__question">Are you sure you want to remove selected task(s)?</p>
          <div class="buttons">
            <button class="btn btn--blue">Cancel</button>
            <button class="btn btn--red">Remove</button>
          </div>
        </div>
      </div>`;
    document.body.append(modalDelete);
  }

  removeModal() {
    let modal = document.querySelector('.modal-overlay');
    modal.remove();
  }

  disabledDone() {
    const items = document.querySelectorAll('.task-list__item--done');
    items.forEach(item => {
      let buttons = item.querySelector('.task-list__edit.icon-edit');
      buttons.style.display = 'none';
    })
  }

  firstTask() {
    this.init(firstVisit);
  }

  attachListeners() {
    const addButton = document.querySelector('.tasks__title--icon.icon-add');
    addButton.addEventListener('click', () => {
      eventBus.publish('show');
    });


    const global = document.querySelector('.global-block');
    const taskContainer = document.querySelector('.tasks.container');

    const buttons = document.querySelector('.buttons');

    if (buttons) {
      buttons.addEventListener('click', evt => {
        if (evt.target.classList.contains('btn--blue', 'btn--big')) {
          eventBus.publish('hideGreet');
        }
        if (evt.target.classList.contains('btn--green', 'btn--small')) {
          eventBus.publish('navigation', 'settings');
        }
      })
    }

    if (global) {
      global.addEventListener('click', (evt) => this.globalVisibility(evt, global));
    }

    taskContainer.addEventListener('click', evt => {

      let attr = evt.target.dataset.filter;
      if (evt.target.classList.contains('done')) {
        this.renderPage(this._model.sortArr().done);
        this.disabledDone();
        this.addActiveStatus(evt.target);
        this.attachListeners();
      } else if (evt.target.classList.contains('todo')) {
        this.renderPage(this._model.sortArr().toDo);
        this.attachListeners();
      }

      if (evt.target.classList.contains('priority')) {

        if (evt.target.parentNode.classList.contains('tab-tasks--done')) {
          this.renderPage(this._model.sortArr(attr).done);
          this.addActiveState(evt.target);
          this.attachListeners();
        } else {
          this.renderPage(this._model.sortArr(attr).toDo);
          this.addActiveState(evt.target);

          this.attachListeners();
        }
      }

      if (evt.target.classList.contains('task-list__priority')) {
        const currentElement = this._model.findItem(evt.target.parentNode.dataset.id);
        if (currentElement.status === 'DAILY_LIST' && currentElement.status !== 'COMPLETED') {
          eventBus.publish('activeState', currentElement);
          eventBus.publish('navigation', 'timer');
        }
      }

    });

    const tasks = document.querySelector('.tasks.container');
    tasks.addEventListener('click', (evt) => {
      let id;
      if (evt.target.classList.contains('task-list__edit')) {
        id = evt.target.parentNode.parentNode.dataset.id;
        eventBus.publish('show', this._model.findItem(id));
        let trash = document.querySelector('.icon-trash').addEventListener('click', () => {
          eventBus.publish('singleDelete', id);
        })

      }
      if (evt.target.classList.contains('task-list__up')) {
        const id = evt.target.parentNode.parentNode.dataset.id;
        this._model.moveUp(id);
        this.renderPage();
        this.attachListeners();
      }
    });

    tasks.addEventListener('click', evt => {
      this.checkDelete(evt);
      this.countDelete();
    });


    const trash = document.querySelector('.menu__icon.icon-trash');
    trash.addEventListener('click', this.basketNotificate);


  }

  basketNotificate(evt) {
    eventBus.publish('basket', evt);
  }

  detachListeners() {
    const basket = document.querySelector('.menu__icon.icon-trash');
    basket.removeEventListener('click', this.basketNotificate);
  }

}
