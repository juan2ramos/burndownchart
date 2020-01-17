import Board from '@/services/Board';

function getDate(date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return new Date(year, month, day);
}
function orderTask(task) {
  const group = task.reduce((r, a) => {
    const c = r;
    const cp = getDate(new Date(a.due));
    c[cp] = [...c[cp] || [], a];
    return r;
  }, {});
  const taskArray = Object.entries(group);
  const d = taskArray.map((x) => {
    let day = new Date(x[0]).getDate();
    day = (day < 10) ? `0${day}` : day;
    let month = new Date(x[0]).getMonth() + 1;
    month = (month < 10) ? `0${month}` : month;
    const date = `${day}/${month}/${new Date(x[0]).getFullYear()}`;
    let points;
    if (x[1].length === 1) {
      const p1 = JSON.parse(x[1][0].pluginData[0].value);
      ({ points } = p1);
    } else {
      points = x[1].reduce((a, b) => {
        const p1 = JSON.parse(a.pluginData[0].value);
        const p2 = JSON.parse(b.pluginData[0].value);
        return p1.points + p2.points;
      });
    }
    return { date, points };
  });
  return d;
}
async function getTask(url) {
  const urlApi = await Board(url);
  const data = await fetch(urlApi)
    .then(response => response.json());
  const result = data
    .filter((task) => {
      if (task.due) {
        return task.dueComplete === true && getDate(new Date()) >= getDate(new Date(task.due));
      }
      return false;
    });
  return orderTask(result);
}

export { getDate, getTask };
