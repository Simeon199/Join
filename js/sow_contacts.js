// const BASE_URL = 'https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/';

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
  // console.log(responseAsJson)
}
