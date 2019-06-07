/* root component starts here */
import {Router} from "./router";
import {TaskList} from "./pages/tasks-list/tasks-list";
import {Timer} from "./pages/timer/timer";
import {Reports} from "./pages/reports/reports";
import {Settings} from "./pages/settings";
import {Header} from './components/header'
import {Modal} from "./pages/tasks-list/modal";
import {eventBus} from "./EventBus";
import {Base} from "./firebase";

require('assets/less/main.less');
require('./router');
require('./components/header/header');
require('./firebase');
var uniqid = require('uniqid');


const main = document.querySelector('main');
const timer = new Timer(main);
const reports = new Reports(main);
const setting = new Settings(main);
const taskList = new TaskList(main);
const modal = new Modal();

Header.render();

Router.config({mode: 'history'});
Router
  .add(/settings$/, function () {
    Base.getData('settings')
      .then(data => setting.rend(data.data()));
    Router.navigate(`/settings/\pomodoros/`).check();
  })
  .add(`/settings/\/pomodoros/`, function () {
    Base.getData('settings')
      .then(data => setting.rend(data.data()));
  })
  .add(`/settings/\/categories/`, function () {
    this.settings.renderCategory();
  })
  .add(/task-list/, function () {
    Base.getData('taskList')
    .then(data => taskList.initData(data.data()));

  })
  .add(/timer/, function () {
    Base.getData('settings')
      .then(data => timer.init(data.data()));
  })

  .add(/reports$/, function () {
    Base.getData('taskList')
      .then(data => reports.init(data.data()));
    Router.navigate('/reports\/day\/tasks')
  });

Router.navigate(/task-list/).check();

eventBus.subscribe('dataChange', (data) => Base.setData('taskList', data));
eventBus.subscribe('navigation', (root) => Router.navigate(root).check());


