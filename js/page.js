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
        if (film["poster_path"]) {
            poster.src = getImageLinkOfFilm(film["poster_path"], POSTER_SIZES[5])
        } else {
            poster.src = "placeholder.png";
        }
        poster.alt = `A poster for ${film["title"]}`;

        let title = titles[i];
        title.textContent = film["title"];

        let release = releaseDates[i];
        release.textContent = film["release_date"];

        let rating = ratings[i];
        rating.textContent = film["vote_average"].toFixed(2);
    }
}

async function updateForFilms(func, ...args) {
    let json = await func.apply(this, args);
    let films = json["results"];

    updateFilmCardDetails(films);
}

function activateButton(newButton) {
    let buttons = document.querySelectorAll("button.btn.btn-primary.link-light");
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    if (newButton) {
        buttons.forEach(button => {
            button.classList.remove("prev-active");
        });

        newButton.classList.add("active", "prev-active");
    }
}

async function main() {
    let upcomingButton = document.querySelector("#upcomingButton");
    upcomingButton.onclick = async () => {
        activateButton(upcomingButton);
        await updateForFilms(getUpcomingFilms);
    }

    let popularButton = document.querySelector("#popularButton");
    popularButton.onclick = async () => {
        activateButton(popularButton);
        await updateForFilms(getPopularFilms);
    }

    let nowPlayingButton = document.querySelector("#nowPlayingButton");
    nowPlayingButton.onclick = async () => {
        activateButton(nowPlayingButton);
        await updateForFilms(getNowPlayingFilms);
    }

    const debouncedSearch = debounce(async (query) => {
        // If the search box is empty, don't do a search.
        if (!query) {
            let prevButton = document.querySelector(".prev-active");
            await prevButton.onclick();
            return;
        }

        activateButton();
        await updateForFilms(getSearchData, query);
    }, 700);

    let searchBox = document.querySelector("#searchBox");
    searchBox.addEventListener("input", (event) => {
        const query = event.target.value;
        debouncedSearch(query);
    });
    // a backup for whenever the <Enter> key is pressed
    searchBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const query = event.target.value;
            debouncedSearch(query);
        }
    });

    // executions
    await setSessionConstants();

    activateButton(upcomingButton);
    await updateForFilms(getUpcomingFilms);
}

console.log("loaded")
document.addEventListener("DOMContentLoaded", main);

// !TODO: Should be environmental, so minimal calls if at all possible (https://developer.themoviedb.org/docs/append-to-response), very efficient code
// !TODO: progressive enhancement on all pages
// !TODO: save movie page data in localStorage as cache with ID as key - data limit - save with reverse queue to keep only most recent requests
//        https://developer.themoviedb.org/docs/append-to-response
