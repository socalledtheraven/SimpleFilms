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
    return await getJSON(`https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}`);
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
    let json = await getJSON(`https://api.themoviedb.org/3/configuration?api_key={API_KEY}`);
    return json["images"];
}

function getListOfFilms(films) {
    // creates the nodes for the films themselves
    let ul = document.createElement("ul");
    for (let film of films) {
        let li = document.createElement("li");
        li.textContent = film["title"];

        let img = document.createElement("img");
        img.src = getImageLinkOfFilm(film, POSTER_SIZES[4])

        li.appendChild(img);
        ul.appendChild(li);
    }

    return ul;
}

async function updatePage() {
    let json = await getPopularFilms();
    let films = json["results"];

    let list = getListOfFilms(films);

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
document.addEventListener("DOMContentLoaded", updatePage);

// Should be environmental, so minimal calls if at all possible, very efficient code
