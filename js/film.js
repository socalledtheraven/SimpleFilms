import {getFilmDetails, getImageLinkOfCastMember, getImageLinkOfFilm} from "../js/tmdb_data.js";
import {POSTER_SIZES, setSessionConstants} from "../js/utilities.js";

function getFilmID() {
    // return 846422;
    return window.location.href.split("?id=").pop();
}

function createPills(items, type) {
    let pills = [];

    if (type === "keyword") {
        // this one is inexplicably nested further
        items = items["keywords"]
    }

    for (let item of items) {
        let pill = document.createElement("a");
        pill.classList.add("badge", "badge-custom", "p-2", "m-1");

        pill.textContent = item["name"];
        pill.href = `https://www.themoviedb.org/${type}/${item["id"]}-${item["name"].replaceAll(" ", "-")}/movie`;

        pills.push(pill);
    }

    return pills;
}

function createCastCards(data) {
    let cards = [];

    for (let member of data) {
        // checks that they have a picture before adding them
        if (member["profile_path"]) {
            let link = document.createElement("a");
            link.href = `https://www.themoviedb.org/person/${member["id"]}-${member["name"].replaceAll(" ", "-")}`;
            link.textContent = member["name"];

            let card = document.createElement("img");
            card.classList.add("cast-member", "rounded-3");

            card.src = getImageLinkOfCastMember(member["profile_path"]);
            card.alt = `A picture of ${member["name"]}`;
            link.appendChild(card);
            cards.push(link);
        }
    }

    return cards;
}

function updatePageElements(data) {
    let metaTitle = document.querySelector("title");
    metaTitle.textContent = `SimpleFilms - ${data["title"]}`;

    let metaDescription = document.querySelector("meta[name='description']");
    metaDescription.content = `The SimpleFilms film viewing website page for ${data["title"]}`

    let title = document.querySelector("#title");
    title.textContent = data["title"];

    let poster = document.querySelector("#poster")
    if (data["poster_path"]) {
        poster.src = getImageLinkOfFilm(data["poster_path"], POSTER_SIZES[5])
    } else {
        poster.src = "placeholder.png";
    }
    poster.alt = `A poster for ${data["title"]}`;

    try {
        let description = document.querySelector("#description");
        description.textContent = data["overview"];
    } catch (e) {
        console.log(e.message);
    }

    try {
        let castSection = document.querySelector("#castList");
        let castData = data["credits"]["cast"];
        let cast = createCastCards(castData);
        castSection.append(...cast);
    } catch (e) {
        console.log(e.message);
    }

    try {
        let genres = createPills(data["genres"], "genre");
        let genreSection = document.querySelector("#genresSection").children[0];
        genreSection.append(...genres);
    } catch (e) {
        console.log(e.message);
    }

    try {
        let rating = document.querySelector("#rating");
        rating.textContent = data["vote_average"].toFixed(2);
    } catch (e) {
        console.log(e.message);
    }

    try {
        let keywords = createPills(data["keywords"], "keyword");
        let keywordsSection = document.querySelector("#keywordSection");
        keywordsSection.append(...keywords);
    } catch (e) {
        console.log(e.message);
    }

    try {
        let trailer = document.querySelector("#trailer");
        let urlFrag = data["videos"]["results"].filter(obj => {
            return obj["type"] === "Trailer";
        })[0]["key"];
        trailer.src = `https://www.youtube.com/embed/${urlFrag}`;
    } catch (e) {
        console.log(e.message);
    }
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

// !TODO: add functionality to search bar on film pages