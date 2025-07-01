const API_KEY;
let BASE_URL;
// should let you get the different sizes by simply changing array index
let POSTER_SIZES;

async function getJSON(url) {
    // gets the HTML and document object of a url
    let response = await fetch(url);

    let navPageHTML = await response.text();

    // this is standard parsing
    return JSON.parse(navPageHTML);
}

async function getPopularFilms() {
    return await getJSON(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
}

async function getNowPlayingFilms() {
    return await getJSON(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`);
}

async function getUpcomingFilms() {
    return await getJSON(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`);
}

function getImageLinkOfFilm(film, size_index = 6) {
    // checks that it's a valid size, just in case I pass the wrong thing in
    if (0 < size_index < POSTER_SIZES.length) {
        let urlFrag = film["poster_path"];
        return BASE_URL + size_index + urlFrag;
    } else {
        throw new Error("size " + size_index + " invalid");
    }
}

async function getImageAPIData() {
    // gets the data about what image sizes are available and the correct url to use
    let json = await getJSON(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`);
    return json["images"];
}

function createListOfFilms(films) {
    // creates the nodes for the films themselves
    let posters = document.createElement("div");
    posters.classList.add("container");

    // we need a row so that it all bends around and handles different viewports well
    let row = document.createElement("div");
    row.classList.add("row", "mt-4"); // adds a top border to the whole row; when rendered, this means just the top bit

    for (let film of films) {
        let card =  document.createElement("div");
        card.classList.add("col-6", "col-md-4", "col-lg-3", "mb-4"); // adds breakpoints for different screen sizes and appropriate spacing (mb-4)

        let poster = document.createElement("img");
        poster.src = getImageLinkOfFilm(film, POSTER_SIZES[5])
        poster.alt = `A poster for ${film["title"]}`;
        poster.classList.add("img-fluid"); // makes images responsive

        card.appendChild(poster);
        row.appendChild(card);
    }

    posters.appendChild(row);

    return posters;
}

async function updatePage() {
    let json = await getUpcomingFilms();
    let films = json["results"];

    let list = createListOfFilms(films);

    let body = document.querySelector("body");
    body.appendChild(list);
}

async function main() {
    // sets global constants for the rest of the program
    let imageData = await getImageAPIData();
    BASE_URL = imageData["secure_base_url"];
    POSTER_SIZES = imageData["poster_sizes"];

    await updatePage();
}

console.log("loaded")
document.addEventListener("DOMContentLoaded", main);

// Should be environmental, so minimal calls if at all possible, very efficient code
