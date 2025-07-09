import {BASE_URL, getJSON, POSTER_SIZES} from "./utilities.js";
import {API_KEY} from "./secrets.js";

export async function getPopularFilms() {
    return await getJSON(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
}

export async function getNowPlayingFilms() {
    return await getJSON(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`);
}

export async function getUpcomingFilms() {
    return await getJSON(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`);
}

export async function getImageAPIData() {
    // gets the data about what image sizes are available and the correct url to use
    let json = await getJSON(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`);
    return json["images"];
}

export async function getGenreData() {
    let json = await getJSON(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    // maps the weird `{ "id": 28, "name": "Action" }` thing to proper values
    return new Map(
        json["genres"].map(genre => [genre.id, genre.name])
    )
}

export async function getSearchData(query) {
    return await getJSON(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=true&language=en-GB&page=1&api_key=${API_KEY}`)
}

export async function getFilmDetails(film_id) {
    return await getJSON(`https://api.themoviedb.org/3/movie/${film_id}?append_to_response=credits%2Cvideos%2Ckeywords&api_key=${API_KEY}`)
}

export function getImageLinkOfFilm(film_data, size_index = 6) { // defaults to a reasonable size
    // checks that it's a valid size, just in case I pass the wrong thing in
    if (0 < size_index < POSTER_SIZES.length) {
        let urlFrag = film_data["poster_path"];
        return BASE_URL + size_index + urlFrag;
    } else {
        throw new Error("size " + size_index + " invalid");
    }
}