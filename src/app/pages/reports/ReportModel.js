export class ReportModel {
  constructor() {
    this._data = this.data;
  }

  generateData(length) {
    let days = [];
    let day = new Date();

    for (let i = 1; i <= length; i++) {
      days.push({
        day: new Date(day.toISOString()).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric',}),
        urgent: 0,
        high: 0,
        middle: 0,
        low: 0,
        failed: 0,
      });
      day.setDate(day.getDate() - 1);
    }
    return days
  }

  transpilePriority(num) {
    const arr = ['low', 'middle', 'high', 'urgent'];
    return arr[num];
  }

  setValue(length, type) {
    let days = this.generateData(length);
    this.data.tasks.forEach(item => {
      if (item.status === 'COMPLETED') {
        const pos = days.findIndex(el => el.day === item.completeDate.toDate().toLocaleDateString());
        if (pos >= 0) {
          if (type === 'pomodoros') {
            if (item.failedPomodoros) {
              days[pos].failed += item.failedPomodoros;
            }
            days[pos][this.transpilePriority(item.priority)] += item.completedCount;
          } else {
            item.completedCount >= item.failedPomodoros ? days[pos][this.transpilePriority(item.priority)]++ : days[pos].failed++;
          }
        }
      }
    });
    return days;
  }


  get data() {
    return this._data
  }

  set data(data) {
    this._data = data
  }
}
