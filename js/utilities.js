import {getGenreData, getImageAPIData} from "./tmdb_data.js";

export let BASE_URL;
export let POSTER_SIZES;
export let GENRE_DATA;

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
    BASE_URL = imageData["secure_base_url"];

    // should let you get the different sizes by simply changing array index
    POSTER_SIZES = imageData["poster_sizes"];

    GENRE_DATA = await getGenreData();
}

export function debounce(func, delay) {
    let timeoutId;

    return function(...args) {
        // Clear the previous timeout if it exists
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set a new timeout
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}