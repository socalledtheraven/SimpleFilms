import {getFilmDetails, getImageLinkOfFilm} from "../../Website Project - Copy/js/tmdb_data.js";
import {POSTER_SIZES} from "../../Website Project - Copy/js/utilities.js";

function getFilmID() {
    return window.location.href.split("?id=").pop();
}

function updatePageElements(data) {
    let metaTitle = document.querySelector("title");
    metaTitle.text = data["title"];

    let title = document.querySelector("#title");
    title.text = data["title"];

    let poster = document.querySelector("#poster")
    if (data["poster_path"]) {
        poster.src = getImageLinkOfFilm(data["poster_path"], POSTER_SIZES[5])
    } else {
        poster.src = "placeholder.png";
    }
    poster.alt = `A poster for ${data["title"]}`;

    let trailer = document.querySelector("#trailer");
    let embed = getEmbed(data);

    let genres = createPills(data["genres"]);

    let rating = document.querySelector("#rating");

    let keywords = createPills(data["keywords"]);


    let description = document.querySelector("#description");
    description.text = data["description"];
}

function main() {
    let id = getFilmID();

    let data = getFilmDetails(id);

    updatePageElements(data);
}

console.log("loaded")
document.addEventListener("DOMContentLoaded", main);

// !TODO: fix what's currently broken and make it look not bad
// !TODO: make poster bigger
// !TODO: add links to tmdb for all things i'm not making a page for
// !TODO: needs to be responsive!