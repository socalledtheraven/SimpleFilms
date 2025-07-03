import {getImageLinkOfFilm, getUpcomingFilms} from "./tmdb_data";
import {POSTER_SIZES, setSessionConstants} from "./utilities";

function createFilmPosterCards(films) {
    // creates the nodes for the films themselves
    let posters = document.createElement("section");
    posters.classList.add("container");

    // we need a row so that it all bends around and handles different viewports well
    let row = document.createElement("row");
    row.classList.add("row", "mt-4"); // adds a top border to the whole row; when rendered, this means just the top bit

    for (let film of films) {
        let column =  document.createElement("article");
        column.classList.add("col-6", "col-md-4", "col-lg-3", "mb-4"); // adds breakpoints for different screen sizes and appropriate spacing (mb-4)

        let card = document.createElement("div");
        card.classList.add("card");

        let poster = document.createElement("img");
        poster.src = getImageLinkOfFilm(film, POSTER_SIZES[5])
        poster.alt = `A poster for ${film["title"]}`;
        poster.classList.add("card-img-top", "img-fluid"); // makes images responsive

        let overlay = document.createElement("div");
        overlay.classList.add("card-img-overlay");

        let title = document.createElement("h5");
        title.classList.add("card-title", "bg-dark", "text-white");
        title.textContent = film["title"];

        let release = document.createElement("p");
        release.classList.add("card-text", "bg-dark", "text-white");
        release.textContent = film["release_date"];

        overlay.appendChild(title);
        overlay.appendChild(release);

        card.appendChild(poster);
        card.appendChild(overlay);
        column.appendChild(card);
        row.appendChild(column);
    }

    posters.appendChild(row);

    return posters;
}

async function updatePage() {
    let json = await getUpcomingFilms();
    let films = json["results"];

    let list = createFilmPosterCards(films);

    let body = document.querySelector("body");
    body.appendChild(list);
}

async function main() {
    await setSessionConstants();
    await updatePage();
}

console.log("loaded")
document.addEventListener("DOMContentLoaded", main);

// !TODO: Should be environmental, so minimal calls if at all possible (https://developer.themoviedb.org/docs/append-to-response), very efficient code
// !TODO: progressive enhancement on all pages
// !TODO: incremental search: https://blog.codinghorror.com/search-if-it-isnt-incremental-its-excremental/
//        add event for listening to the keyboard presses and wait for a break in the timing
// !TODO: save movie page data in localStorage as cache with ID as key - data limit - save with reverse queue to keep only most recent requests
//        https://developer.themoviedb.org/docs/append-to-response
