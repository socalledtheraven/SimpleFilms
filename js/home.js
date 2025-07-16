import {getImageLinkOfFilm, getFilmsPlayingNow, getPopularFilms, getSearchData, getUpcomingFilms} from "../js/tmdb_data.js";
import {debounce, POSTER_SIZES, setSessionConstants} from "../js/utilities.js";

let CURRENT_FUNCTION;

function addNewFilmCards(films) {
    let row = document.querySelector("section.row");
    row.hidden = true;

    for (let i = 0; i < Object.keys(films).length; i++) {
        let film = films[i];

        let col = document.createElement("a");
        col.classList.add("col-6", "col-md-4", "col-lg-3", "mb-4", "offset-md-0");
        col.href = `film.html?id=${film["id"]}`

        let card = document.createElement("div");
        card.classList.add("card", "rounded-4", "position-relative", "overflow-hidden");

        let poster = document.createElement("img");
        poster.classList.add("img-fluid", "card-img", "w-100", "d-block", "rounded-4"); // gives rounded corners and fitting to container
        if (film["poster_path"]) {
            poster.src = getImageLinkOfFilm(film["poster_path"], POSTER_SIZES[5])
        } else {
            poster.src = "placeholder.png";
        }
        poster.alt = `A poster for ${film["title"]}`;

        let caption = document.createElement("div");
        caption.classList.add("bg-body-secondary", "bg-opacity-75", "position-absolute", "start-0", "bottom-0", "end-0", "card-caption");

        let topLine = document.createElement("section");

        topLine.classList.add("d-flex", "justify-content-between", "ms-1", "me-1");
        let release = document.createElement("span");

        release.textContent = film["release_date"].split("-").reverse().join("/"); // formats the datestring in the correct manner without need for a library
        release.classList.add("release-date", "fs-5")
        let rating = document.createElement("span");

        rating.classList.add("fs-5", "d-flex", "align-items-center", "rating");
        rating.textContent = film["vote_average"].toFixed(2);
        let star = document.createElement("svg");

        star.classList.add("ms-1");
        star.width = 16;
        star.height = 16;
        let use = document.createElement("use");

        use.href = "#star";
        star.appendChild(use);

        rating.appendChild(star);
        topLine.appendChild(release)
        topLine.appendChild(rating);

        let title = document.createElement("h4");
        title.classList.add("text-center", "mb-1")
        let titleText = document.createElement("strong");
        titleText.textContent = film["title"];
        title.appendChild(titleText);

        caption.appendChild(topLine);
        caption.appendChild(title);

        card.appendChild(poster);
        card.appendChild(caption);

        col.appendChild(card);

        row.appendChild(col);
    }

    row.hidden = false;
}

function removeExistingFilmCards() {
    let existingCards = document.querySelectorAll("section > div.col-6");
    existingCards.forEach(card => {
        card.remove();
    });
}

async function updateForFilms(func, ...args) {
    CURRENT_FUNCTION = func;
    let json = await func.apply(this, args);
    let films = json["results"];

    removeExistingFilmCards();
    addNewFilmCards(films);
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
        await updateForFilms(() => {
            getUpcomingFilms(0);
        });
    }

    let popularButton = document.querySelector("#popularButton");
    popularButton.onclick = async () => {
        activateButton(popularButton);
        await updateForFilms(() => {
            getPopularFilms(0);
        });
    }

    let nowPlayingButton = document.querySelector("#nowPlayingButton");
    nowPlayingButton.onclick = async () => {
        activateButton(nowPlayingButton);
        await updateForFilms(() => {
            getFilmsPlayingNow(0);
        });
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

    activateButton(nowPlayingButton);
    await updateForFilms(getFilmsPlayingNow);

    window.addEventListener("scroll", async () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight + 50) { // adds a little buffer when getting to the end
            await updateForFilms(async () => {

                await CURRENT_FUNCTION.apply(this, );
            });
        }
    });
}

console.log("loaded")
document.addEventListener("DOMContentLoaded", main);

// !TODO:   Should be environmental, so minimal calls if at all possible (https://developer.themoviedb.org/docs/append-to-response), very efficient code
// !TODO:   save movie page data in localStorage as cache with ID as key - data limit - save with reverse queue to keep only most recent requests
//              https://developer.themoviedb.org/docs/append-to-response
// !TODO:   detect scrolls and load more pages of results
// !TODO:   a little popup on the search page with details from search api leading to big page
//              call the api for the details as soon as they open the api and then the big page will
// !TODO:   handle zero results for search!
// !TODO:   error handling
// !TODO:   fix secrets.js being pushed