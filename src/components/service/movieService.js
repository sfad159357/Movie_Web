import http from "./httpService";

const apiEndpoint = "movies";

function movieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMovies() {
  return http.get(apiEndpoint);
}

export function getMovie(movie_id) {
  return http.get(movieUrl(movie_id));
}

export function deleteMovie(movie_id) {
  return http.delete(movieUrl(movie_id));
}

export function saveMovie(movie) {
  // create new movie
  if (!movie._id) {
    // movieInDb._id = Date.now().toString(); // 幫我們新增沒有新movie的Id，若沒有新增toString()則無法進去編輯新movie
    return http.post(apiEndpoint, movie);
  }

  // update old movie
  const body = { ...movie };
  delete body._id;
  return http.put(movieUrl(movie._id), body); // 後端不接受_id屬性作為request body的一部份，因為如果有人去更改movie._id，但是movie._id也是作為api url的參數，所以更改後哪個是正確的_id?所以後端不接受_id作為body的一部份

  //   return movieInDb;
}
