import React from "react";
import { useQuery } from "react-query";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useParams,
  useLocation,
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="flex">
            <li>
              <NavLink
                exact={true}
                to="/"
                className="p-10 flex"
                activeClassName="text-red-500"
              >
                홈
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/list"
                className="p-10 flex"
                activeClassName="text-red-500"
              >
                영화 리스트
              </NavLink>
            </li>
          </ul>
        </nav>

        <hr />

        <Switch>
          <Route path="/list">
            <MovieList />
          </Route>
          <Route path="/detail">
            <MovieDetail />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

function Home() {
  return <h2>홈</h2>;
}

function MovieList() {
  const { isLoading, error, data } = useQuery("movieList", () =>
    fetch("https://yts.mx/api/v2/list_movies.json?with_images=true").then(
      (res) => res.json()
    )
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <h2>영화 리스트</h2>
      <div>
        <ul>
          {data.data.movies.map((movie) => (
            <li>
              <NavLink to={`/detail?id=${movie.id}`}>
                {movie.id} {movie.title_long}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function MovieDetail() {
  let queryParams = useQueryParams();
  const id = queryParams.get("id");

  const { isLoading, error, data } = useQuery(`movieDetail_${id}`, () =>
    fetch(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_images=true`
    ).then((res) => res.json())
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const movie = data.data.movie;

  return (
    <>
      <h2>영화 상세 {id}</h2>
      <div>
        <h1>제목 : {movie.title_long}</h1>
        <ul>
          <li>번호 : {movie.id}</li>
          <li>장르 : {movie.genres[0]}</li>
          <li>상영시간 : {movie.runtime}분</li>
          <li>줄거리 : {movie.summary}</li>
        </ul>
        <img src={movie.large_cover_image} />
      </div>
    </>
  );
}
