const uniqid = require('uniqid');
import {eventBus} from "../../EventBus";
const modal = require('./templates/modal.hbs');
export class Modal {
  constructor(){
    this.showModal();
  }

  renderModal(data){
    const modalOverlay = document.createElement('div');
    modalOverlay.innerHTML = modal(data);
    modalOverlay.classList.add('modal-overlay');
    document.body.prepend(modalOverlay);
    document.body.style.overflow = 'hidden'
  }
  removeModal(){
    const  modal = document.querySelector('.modal-overlay');
    document.body.removeChild(modal);
    document.body.style.overflow = 'initial'
  }

  showModal(){
    eventBus.subscribe('show',  (task) => {
     this.renderModal(task);
      this.saveTask()
    })
  }

  saveTask (){
    const modal = document.querySelector('.modal');
    let attr;
    modal.addEventListener('click', evt => {
      const form = document.forms['addItem'];
      if (evt.target.classList.contains('complexity__item')){
        attr = evt.target.dataset.estimation;
        let buttons = form.querySelectorAll('.complexity__item');
        buttons.forEach(item => item.classList.remove('complexity__item--done_active'));
        for (let i = 0; i <= attr; i++) {
          buttons[i].classList.add('complexity__item--done_active')
        }
      }
      if (evt.target.classList.contains('button-control__icon--close')){
        this.removeModal()
      }
      if (evt.target.classList.contains('button-control__icon--check')) {
        const obj = {
          id: form.dataset.id || uniqid(),
          title: form['title'].value,
          description: form['description'].value,
          categoryId: form.querySelector('.group-category__input.category:checked').value,
          estimationUsed: [],
          priority: parseInt(form.querySelector('.group-category__input.priority:checked').value),
          estimation: parseInt(attr) + 1 || 1,
          deadlineDate: new Date(`${form['deadline'].value}`),
          status: 'GLOBAL_LIST',
          createDate: new Date().getTime(),
          completedCount: 0,
          failedPomodoros: 0,
          completeDate:  new Date(),
          isActive: true,
        };
        eventBus.publish('save', obj);
        this.removeModal();
      }
    })
  }
}


