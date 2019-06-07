// const head = require('./header.less'); // example of including component's styles
import {eventBus} from "../../EventBus";

const headerComponent = require('./header.hbs');

export class Header {
  constructor(){}

  static render(){

    const header = document.createElement('header');
    header.classList.add('header');
    document.body.prepend(header);
    header.innerHTML = headerComponent();
    header.addEventListener('click', evt => {
      let parent = evt.target.parentNode;
      let attr = parent.dataset.link;
      if (evt.target.classList.contains('menu__icon')){
        evt.preventDefault();
        eventBus.publish('navigation', attr);
      }
    });

    let isScroll =  false;

    const addScroll = function () {
      if (window.pageYOffset >= 50 && isScroll === false) {
        header.classList.add('scroll');
        isScroll = true;

      } else if (window.pageYOffset < 50 && isScroll === true) {
        header.classList.remove('scroll');
        isScroll = false;
      }
    };
    eventBus.subscribe('data', checkBasket => {
      if (checkBasket.toDo.daily.length){
       let trashBox = document.querySelectorAll('.menu__link');
       if (header.classList.contains('scroll')){

       }
        trashBox[0].classList.remove('none');
        trashBox[1].classList.remove('none');
      }
    });
    window.addEventListener('scroll', addScroll);
  }
}

