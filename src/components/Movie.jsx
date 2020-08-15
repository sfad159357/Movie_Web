import React, { Component } from "react";
import SideList from "./common/SideList";
import MovieTable from "./MovieTable";
import Pagination from "./common/Pagination";
import paginate from "../utils/paginate";
import SearchBox from "./common/SearchBox";
import _ from "lodash";
import { Link } from "react-router-dom";
import { getGenres } from "./service/genreService";
import { getMovies, deleteMovie } from "./service/movieService";
import { toast } from "react-toastify";

// Movie2是作者的方法
export class Movie extends Component {
  state = {
    movies: [], // 這裡沒有定義movies.isLiked，所以是undefined，在判斷式中屬於false
    pageSize: 4, // 一個頁面想要容納多少的item
    currentPage: 1,
    genres: [],
    sortedColumn: { path: "title", order: "asc" },
    searchQuery: "",
  };

  async populateGenres() {
    // 添加All genres物件
    const { data: genresDB } = await getGenres(); // response.data as genresDB []
    const genres = [{ name: "All genres", _id: 0 }, ...genresDB];
    // 等效genres: genres
    // 如果宣告長得完全一樣{name: "All genres", _id: 0 }的物件，卻跟上面genre陣列新增的{name: "All genres", _id: 0}是不一樣的!==
    // -> 明明物件長的一樣，why? 另外宣告物件雖然長的一樣，但是記憶體位置卻不一樣，在===算false。除非用參照給值方式儲存，就是要源自於原本的物件來儲存值到變數當中，記憶體的位置才會是一樣。
    this.setState({ genres, selectedGenre: genres[0] });
  }

  async populateMovies() {
    const { data: movies } = await getMovies();
    this.setState({
      movies,
    });
  }

  // 在元件渲染到實體DOM掛載後的函式
  async componentDidMount() {
    console.log("Movie CMD");
    await this.populateGenres();
    await this.populateMovies();
  }

  moviesDataHandled = () => {
    const {
      movies: allMovies,
      pageSize,
      currentPage,
      selectedGenre,
      sortedColumn,
      searchQuery,
    } = this.state;

    // 先假設在searchQuery=""和selectedGenre._id=0時，篩選的電影為allMovies，否則一開始底下兩個條件式都不符合
    let moviesFiltered = allMovies;
    if (searchQuery)
      // 假設已在搜尋框輸入文字的情況下
      // 一旦輸入任一文字，selectedGenre馬上被設為null
      moviesFiltered = allMovies.filter((movie) =>
        movie.title.toLowerCase().startsWith(searchQuery.toLocaleLowerCase())
      );
    else if (selectedGenre && selectedGenre._id) {
      // 如果選擇All genres時，selectedGenre._id會是0，所以條件為false。
      // selectedGenre._id非0為true，才會進行下列code
      moviesFiltered = allMovies.filter(
        (movie) => movie.genre._id === selectedGenre._id
      );
    }

    // 參1是要待排列的物件陣列，參2由於可能會排列多種column，所以裡面一樣是陣列形式，參3對照參2有多少column個別安排是'asc'還'dsc'。
    const moviesSorted = _.orderBy(
      moviesFiltered,
      [sortedColumn.path],
      [sortedColumn.order]
    );

    const moviesPaged = paginate(moviesSorted, currentPage, pageSize);

    return { moviesFiltered, moviesPaged };
  };

  render() {
    console.log("Movie render");
    const {
      pageSize,
      currentPage,
      genres,
      selectedGenre,
      sortedColumn,
      searchQuery,
    } = this.state;

    const { user } = this.props;

    const { moviesFiltered, moviesPaged } = this.moviesDataHandled();

    return (
      <div className="row">
        <div className="col-3 mt-5">
          <SideList
            items={genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={selectedGenre}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              // style={{ marginBottom: 5 }}
            >
              New Movie
            </Link>
          )}
          <nav className="mt-4">
            Showing
            <span style={{ color: "red", fontWeight: "bold" }}>
              {" "}
              {moviesFiltered.length}{" "}
            </span>
            movies in the database.
          </nav>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MovieTable
            moviesPaged={moviesPaged} // 分頁後的電影
            sortedColumn={sortedColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            // 在Pagination元件所產生的event伴隨著參數，要返回來做handle event和參數處理
            onPageChange={this.handlePageChange}
            itemsCount={moviesFiltered.length} // 所有電影中的總數
            pageSize={pageSize}
            currentPage={currentPage} // 當前頁面
          />
        </div>
      </div>
    );
  }

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedGenre: this.state.genres[0], // 將selectedGenre設置為All genres物件
      currentPage: 1,
    }); // 搜尋時，將取消genre種類，並將分頁轉到第一頁，以免使用者停留在原分頁
  };

  handleSort = (sortedColumn) => {
    this.setState({ sortedColumn }); // ascending升序
  };
  // 傳回來的雖然是叫item的參數，但在母元件可以清楚的命名為genre
  handleGenreSelect = (genre) => {
    this.setState({
      selectedGenre: genre,
      searchQuery: "", // 當使用者選擇genre種類，清空搜尋字串
      currentPage: 1, // 這裡要重設為第1頁，是因為在第2頁是因為movies超過pageSize=4，所以從startIndex=4開始切割
    }); // ->不過，我們丟到paginate(filtered)，經過filtered的movies只有3個，所以因為state中currentPage還在2，一樣會幫你從index=4的元素開始切割
  };

  handlePageChange = (pageNumber) => {
    console.log("pageChange");
    // console.log(pageNumber);
    this.setState({
      currentPage: pageNumber,
    });
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    // const movie = movies.filter((movie) => movie.movie === movie)[0]; // 就算filter出一個物件，最後還是以[]包起來
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].isLiked = !movies[index].isLiked;
    this.setState({
      movies,
    });
  };

  handleDelete = async (movie_id) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((movie) => movie._id !== movie_id);
    this.setState({
      movies,
    });

    try {
      await deleteMovie(movie_id); // 真正從後台刪除指定id的movie，下面是前端的呈現
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("錯誤：找不到此movie");
      }
      this.setState({ movies: originalMovies });
    }
  };
}

export default Movie;
