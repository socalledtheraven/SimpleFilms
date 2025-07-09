import {getImageLinkOfFilm, getNowPlayingFilms, getPopularFilms, getSearchData, getUpcomingFilms} from "./tmdb_data.js";
import {debounce, POSTER_SIZES, setSessionConstants} from "./utilities.js";

function updateFilmCardDetails(films) {
    let posters = document.querySelectorAll("img");
    let titles = document.querySelectorAll("h4");
    let releaseDates = document.querySelectorAll(".release-date");
    let ratings = document.querySelectorAll(".rating");

    for (let i = 0; i < Object.keys(films).length; i++) {
        let film = films[i];

        let poster = posters[i];
        poster.src = getImageLinkOfFilm(film, POSTER_SIZES[5])
        poster.alt = `A poster for ${film["title"]}`;

        let title = titles[i];
        title.textContent = film["title"];

        let release = releaseDates[i];
        release.textContent = film["release_date"];

        let rating = ratings[i];
        rating.textContent = (Math.round((film["vote_average"] + Number.EPSILON) * 100) / 100).toString();
    }
}

async function updateForFilms(func, ...args) {
    let json = await func.apply(this, args);
    let films = json["results"];

    updateFilmCardDetails(films);
}

async function main() {
    await setSessionConstants();
    await updateForFilms(getUpcomingFilms);

    let upcomingButton = document.querySelector("#upcomingButton");
    upcomingButton.onclick = async () => {
        await updateForFilms(getUpcomingFilms);
    }

    let popularButton = document.querySelector("#popularButton");
    popularButton.onclick = async () => {
        await updateForFilms(getPopularFilms);
    }

    let nowPlayingButton = document.querySelector("#nowPlayingButton");
    nowPlayingButton.onclick = async () => {
        await updateForFilms(getNowPlayingFilms);
    }
}

console.log("loaded")
document.addEventListener("DOMContentLoaded", main);

// !TODO: Should be environmental, so minimal calls if at all possible (https://developer.themoviedb.org/docs/append-to-response), very efficient code
// !TODO: progressive enhancement on all pages
// !TODO: incremental search: https://blog.codinghorror.com/search-if-it-isnt-incremental-its-excremental/
//        add event for listening to the keyboard presses and wait for a break in the timing
// !TODO: save movie page data in localStorage as cache with ID as key - data limit - save with reverse queue to keep only most recent requests
//        https://developer.themoviedb.org/docs/append-to-response
