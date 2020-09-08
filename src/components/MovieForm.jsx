import React from "react";
import Form from "./common/Form";
import Joi from "joi-browser";
import { getMovie, saveMovie } from "./service/movieService";
import { getGenres } from "./service/genreService";
import { toast } from "react-toastify";

export class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().trim().min(5).required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .min(0)
      .max(100)
      .required()
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .min(1)
      .max(10)
      .required()
      .label("Daily Rental Rate"),
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovies() {
    try {
      // 利用Route path="{url}"中的:id來取得參數
      const movieId = this.props.match.params.id;
      if (movieId === "new") return; // 如果電影是新增的，則不繼續執行下面的code，也就是一開始沒有_id這個屬性。
      // 上一行的會加個return，是為了不讓不存在的movie去執行setState

      // 取得成功就setState，取得失敗就不會執行setState，而是catch error
      const { data: movie } = await getMovie(movieId);
      this.setState({
        data: this.mapToViewModel(movie),
      }); // 由於前端需要的欄位格式跟後端給的data有點不同，我們欄位不想要有巢狀型態，所以需要在前端對data進行一些微調
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
      // 如果movie get不到，會出現error 404，直接跳至replace，不用push則是因為不讓使用者可以點擊上一頁回去
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovies();
  }

  mapToViewModel(movie) {
    // 已存在的movie，其state中的data有_id屬性
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  doSubmit = async () => {
    try {
      await saveMovie(this.state.data); // 將前端的data儲存到後端，函式會幫助再將前端data的欄位格式轉換成後台需要的格式
      this.props.history.push("/movies");
      toast.success(`已成功更新${this.state.data.title}`);
    } catch (ex) {
      if (ex) toast.error("錯誤：無法更新此movie");
    }
  };

  // title不能輸入中文
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Movie Form</h1>
        {this.renderInput("title", "Title")}
        {this.renderSelect("genreId", "Genre", this.state.genres)}
        {this.renderInput("numberInStock", "Number In Stock", "number")}
        {this.renderInput("dailyRentalRate", "Rate", "number")}
        {this.renderButton("Save")}
      </form>
    );
  }
}

export default MovieForm;
