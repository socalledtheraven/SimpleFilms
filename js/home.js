import {getImageLinkOfFilm, getFilmsPlayingNow, getPopularFilms, getSearchData, getUpcomingFilms} from "../js/tmdb_data.js";
import {debounce, POSTER_SIZES, setSessionConstants} from "../js/utilities.js";

let CURRENT_FUNCTION;

function addNewFilmCards(films) {
    let row = document.querySelector("section.row");
    row.hidden = true;

    if (films.length === 0) {
        handleError("NoResults");
    }

    for (let i = 0; i < Object.keys(films).length; i++) {
        let film = films[i];

        let col = document.createElement("a");
        col.classList.add("col-6", "col-md-4", "col-lg-3", "mb-4", "offset-md-0", "filmCard");
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

        let title = document.createElement("h2");
        title.classList.add("text-center", "mb-2", "fs-4");
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
    let existingCards = document.querySelectorAll(".filmCard");
    existingCards.forEach(card => {
        card.remove();
    });
}

function handleError(type) {
    let message;

    switch (type) {
        case "APIError":
            message = "Sorry! Something went wrong with the API. Please try again later, or check the browser console for more information.";
            break;
        case "NoResults":
            message = "No results for this search.";
            break;
        default:
            message = "Sorry! Something went wrong. Please try again later."
            break;
    }

    let errorElement = document.createElement("h2");
    errorElement.classList.add("text-center", "error", "mt-4");
    errorElement.textContent = message;

    let container = document.querySelector("main .container");

    container.appendChild(errorElement);
}

async function updateForFilms(json) {
    try {
        let films = json["results"];

        removeExistingFilmCards();
        addNewFilmCards(films);
    } catch(e) {
        console.log(e);
        handleError("APIError");
    }
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

async function navButtonAction(type) {
    let json;
    let button;

    switch (type) {
        case "upcoming":
            button = document.querySelector("#upcomingButton");

            json = await getUpcomingFilms(1);
            break;
        case "popular":
            button = document.querySelector("#popularButton");

            json = await getPopularFilms(1);
            break;
        case "nowPlaying":
            button = document.querySelector("#nowPlayingButton");

            json = await getFilmsPlayingNow(1);
            break;
    }
    activateButton(button);

    await updateForFilms(json);
}

function addButtonClickFunctions() {
    let upcomingButton = document.querySelector("#upcomingButton");
    upcomingButton.onclick = async () => {
        await navButtonAction("upcoming");
    }

    let popularButton = document.querySelector("#popularButton");
    popularButton.onclick = async () => {
        await navButtonAction("popular");
    }

    let nowPlayingButton = document.querySelector("#nowPlayingButton");
    nowPlayingButton.onclick = async () => {
        await navButtonAction("nowPlaying");
    }
}

function addSearchBoxListeners() {
    const debouncedSearch = debounce(async (query) => {
        // If the search box is empty, don't do a search.
        if (query) {
            activateButton();

            let json = await getSearchData(query);

            await updateForFilms(json);
        } else {
            let prevButton = document.querySelector(".prev-active");
            await prevButton.click();
        }
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
}

async function main() {
    // executions

    await setSessionConstants();

    addButtonClickFunctions();
    addSearchBoxListeners();

    // loads the view based either on url parameter from last time or default
    let url = document.location.href;
    if (url.includes("?view=")) {
        let view = url.split("?view=")[1];

        await navButtonAction(view);
    } else {
        // defaults to nowPlaying
        await navButtonAction("nowPlaying");
    }

    // window.addEventListener("scroll", async () => {
    //     if (window.innerHeight + window.scrollY >= document.body.offsetHeight + 50) { // adds a little buffer when getting to the end
    //         await updateForFilms(async () => {
    //
    //             await CURRENT_FUNCTION.apply(this, );
    //         });
    //     }
    // });
}

console.log("loaded")
document.addEventListener("DOMContentLoaded", main);

// !TODO:   detect scrolls and load more pages of results