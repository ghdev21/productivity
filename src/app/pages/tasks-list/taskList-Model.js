import {eventBus} from "../../EventBus";

export class TaskListModel {
  constructor() {
    this._data = [];
    this.bool = false;
  }

  setData(data) {
    if (!data) {
      this._data = []
    } else {
      this._data = data.tasks;
      this._data.forEach(item => {
        item.completeDate = item.completeDate.toDate();
        item.deadlineDate = item.deadlineDate.toDate();
      })
    }
  }

  changeStatus (){
    eventBus.subscribe('completedTask', (data) =>{
    let index = this.data.tasks.findIndex(item =>  item.id === data.id);
      this._data[index] = data;
      eventBus.publish('dataChange', this.data)
    });
  }

  findItem(id) {
    return this._data.find(item => item.id === id)
  }

  moveUp(id) {
    const index = this._data.findIndex(el => el.id === id);
    this._data[index].status = 'DAILY_LIST';
    eventBus.publish('dataChange', this.data)
  }

  deleteItem(deletedItem) {
    const deleted = this._data.filter(item => !deletedItem.find(index => index === item.id));
    this.data = deleted;
    eventBus.publish('dataChange', this.data)
  }

  changeItem(obj) {
    const index = this._data.findIndex(el => {
      return el.id === obj.id;
    });
    if (index >= 0) {
      this._data[index].title = obj.title;
      this._data[index].description = obj.description;
      this._data[index].categoryId = obj.categoryId;
      this._data[index].deadlineDate = obj.deadlineDate;
      this._data[index].deadlineDate = obj.deadlineDate;
      this._data[index].estimation = obj.estimation;
      this._data[index].priority = obj.priority;

    } else {
      this.addNew(obj);
    }
    eventBus.publish('dataChange', this.data)
  }

  sortArr(filter = 'all') {

    const sortedArr = {
      toDo: {
        isDeleted: this.bool,
        daily: [],
        global: {
          work: [],
          education: [],
          sport: [],
          other: [],
          hobby: [],
        },
      },
      done: {
        isDeleted: this.bool,
        isDone: true,
        daily: [],
        global: {
          work: [],
          education: [],
          sport: [],
          other: [],
          hobby: [],
        },
      },
    };

    let currentData = new Date();
    this._data.forEach(item => {
      if (item.status === "DAILY_LIST") {
        sortedArr.toDo.daily.push(item)
      } else if (item.status === "GLOBAL_LIST") {
        if (item.priority === +filter || filter === 'all') {
          sortedArr.toDo.global[item.categoryId].push(item)
        }
      }
      if (item.status === 'COMPLETED') {
        if (currentData.toDateString() <= item.completeDate.toDateString()) {
          sortedArr.done.daily.push(item);
        } else if (item.priority === +filter || filter === 'all') {
          sortedArr.done.global[item.categoryId].push(item);
        }
      }
    });
    eventBus.publish('data', sortedArr);
    return sortedArr
  }

  get data() {
    return {tasks: this._data};
  }

  set data(data) {
    this._data = data;
  }

  addNew(obj) {
    this._data.push(obj)
  }
}
