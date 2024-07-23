const BASE_URL = "https://join-privat-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches and returns JSON data from a specified URL.
 *
 * @param {string} path - The path to the JSON file.
 */
async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();
  return responseAsJson;
}
