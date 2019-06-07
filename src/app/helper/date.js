module.exports = function (date, status) {

  if (new Date().getDate().toLocaleString() === date.getDate()) {
    const template = `
    <span class="task-list__prescription date">
              <span class="date__month">today</span>
     </span>
  `;
    return template
  }
  if (new Date().getDate().toLocaleString() > date.getDate() && status !== "COMPLETED") {
    const month = date.toLocaleString('en', {month: 'long'});
    const template = `
       <span class="task-list__prescription task-list__prescription--overdue date">
           <span class="date__day">${date.getDate()}</span>
           <span class="date__month">${month}</span>
        </span>
  `;
    return template
  }
  const month = date.toLocaleString('en', {month: 'long'});
  const template = `
  <span class="task-list__prescription date">
              <span class="date__day">${date.getDate()}</span>
              <span class="date__month">${month}</span>
            </span>
  `;
  return template
};
