import {getGenreData, getImageAPIData} from "./tmdb_data";

export async function getJSON(url) {
    // gets the HTML and document object of a url
    let response = await fetch(url);

    let navPageHTML = await response.text();

    // this is standard parsing
    return JSON.parse(navPageHTML);
}

export async function setSessionConstants() {
    // sets global constants for the rest of the program
    let imageData = await getImageAPIData();
    export const BASE_URL = imageData["secure_base_url"];

    // should let you get the different sizes by simply changing array index
    export const POSTER_SIZES = imageData["poster_sizes"];

    export const GENRE_DATA = await getGenreData();

}