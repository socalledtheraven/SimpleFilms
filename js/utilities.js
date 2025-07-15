import {getGenreData, getImageAPIData} from "./tmdb_data.js";

export let BASE_URL;
export let POSTER_SIZES;
export let GENRE_DATA;

const CACHE_INVALID_TIME = 60 * (60 * 1000);

export async function getData(key, url) {
    let cached = localStorage.getItem(key);

    let json;
    // sends the cached version if it exists, and it's been less than an hour since it was created
    if (cached && ((JSON.parse(cached)["time"] + CACHE_INVALID_TIME) > Date.now())) {
        console.log("loading from cache")

        json = cached;
    } else {
        console.log("loading from hot")
        // gets the HTML and document object of a url
        let response = await fetch(url);

        let jsonSource = await response.text();

        let temp = JSON.parse(jsonSource);
        temp["time"] = Date.now()

        temp = JSON.stringify(temp);
        localStorage.setItem(key, temp);
        json = temp;
    }

    // this is standard parsing
    return JSON.parse(json);
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