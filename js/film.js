import {getFilmDetails, getImageLinkOfFilm} from "../js/tmdb_data.js";
import {POSTER_SIZES, setSessionConstants} from "../js/utilities.js";

function getFilmID() {
    return 846422;
    return window.location.href.split("?id=").pop();
}

function updatePageElements(data) {
    let metaTitle = document.querySelector("title");
    metaTitle.textContent = "SimpleFilms - " + data["title"];

    let title = document.querySelector("#title");
    title.textContent = data["title"];

    let poster = document.querySelector("#poster")
    if (data["poster_path"]) {
        poster.src = getImageLinkOfFilm(data["poster_path"], POSTER_SIZES[5])
    } else {
        poster.src = "placeholder.png";
    }
    poster.alt = `A poster for ${data["title"]}`;

    let trailer = document.querySelector("#trailer");
    let urlFrag = data["videos"]["results"].filter(obj => {
        return obj["type"] === "Trailer";
    })[0]["key"];
    trailer.src = "https://www.youtube.com/embed/" + urlFrag;

    // let genres = createPills(data["genres"]);
    //
    // let rating = document.querySelector("#rating");
    //
    // let keywords = createPills(data["keywords"]);


    let description = document.querySelector("#description");
    description.textContent = data["overview"];
}

async function main() {
    let id = getFilmID();

    await setSessionConstants();

    let data = await getFilmDetails(id);
    console.log(data);

    updatePageElements(data);
}

console.log("loaded")
document.addEventListener("DOMContentLoaded", main);

// !TODO: fix what's currently broken and make it look not bad
// !TODO: make poster bigger
// !TODO: add links to tmdb for all things i'm not making a page for
// !TODO: needs to be responsive!