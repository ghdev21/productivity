export class PagesView {
  constructor(){
  }

  init (template, source){
    const main = document.querySelector('main');
    if (source) {
      main.innerHTML = template(source);
    } else {
      main.innerHTML = template();
    }
  }
}
