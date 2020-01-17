const axios = require('axios');

const key = process.env.VUE_APP_KEY;
const token = process.env.VUE_APP_TOKEN;
const allBoardsURL = `https://api.trello.com/1/members/me/boards?fields=name,url&key=${key}&token=${token}`;
export default async function finishedCards(url) {
  const allBoards = await axios.get(allBoardsURL);
  const myBoard = allBoards.data.find(board => board.url === url);
  const boardId = myBoard.id;
  const allBoardListsURL = `https://api.trello.com/1/boards/${boardId}/lists?cards=none&card_fields=all&filter=open&fields=all&key=${key}&token=${token}`;
  const allLists = await axios.get(allBoardListsURL);
  const doneList = allLists.data.find(list => list.name === 'DONE');
  const idList = doneList.id;
  const allCardsListURL = `https://api.trello.com/1/lists/${idList}/cards?fields=all&key=${key}&token=${token}&pluginData=true`;
  return allCardsListURL;
}
