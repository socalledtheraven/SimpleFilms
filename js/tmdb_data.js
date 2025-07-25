import {BASE_URL, getData, POSTER_SIZES} from "./utilities.js";
import {API_KEY} from "./secrets.js";

export async function getPopularFilms(page = 1) {
    return await getData(`popular_page${page}`, `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`);
}

export async function getFilmsPlayingNow(page = 1) {
    return await getData(`nowPlaying_page${page}`, `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${page}`);
}

export async function getUpcomingFilms(page = 1) {
    return await getData(`upcoming_page${page}`, `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&page=${page}`);
}

export async function getImageAPIData() {
    // gets the data about what image sizes are available and the correct url to use
    let json = await getData("imageData", `https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`);
    return json["images"];
}

export async function getGenreData() {
    let json = await getData("genre", `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    // maps the weird `{ "id": 28, "name": "Action" }` thing to proper values
    return new Map(
        json["genres"].map(genre => [genre.id, genre.name])
    )
}

export async function getSearchData(query, page = 1) {
    return await getData(`search_${encodeURIComponent(query)}`, `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=true&language=en-GB&page=1&api_key=${API_KEY}&page=${page}`)
}

export async function getFilmDetails(film_id) {
    return await getData(`details_${film_id}`, `https://api.themoviedb.org/3/movie/${film_id}?append_to_response=credits%2Cvideos%2Ckeywords&api_key=${API_KEY}`)
}

export function getImageLinkOfFilm(urlFrag, size_index = 6) { // defaults to a reasonable size
    // checks that it's a valid size, just in case I pass the wrong thing in
    if (0 < size_index < POSTER_SIZES.length) {
        return BASE_URL + size_index + urlFrag;
    } else {
        throw new Error("size " + size_index + " invalid");
    }
}

export function getImageLinkOfCastMember(urlFrag) {
    return BASE_URL + "w185" + urlFrag;
}