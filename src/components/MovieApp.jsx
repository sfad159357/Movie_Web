// third-parties package
import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

// Component
import Movie from "./Movie";
import MovieForm from "./MovieForm";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Logout from "./Logout";
import Navbar from "./common/Navbar";
import Customers from "./route/Customers";
import Rentals from "./route/Rentals";
import NotFound from "./route/NotFound";
import auth from "./service/authService";
import ProtectedRoute from "./common/ProtectedRoute";
import Bugs from "./Bugs";
import BugsHook from "./BugsHook";

// css
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

// store
import configureStore from "../store/configStore";

const store = configureStore();

export class MovieApp extends Component {
  state = {};

  componentDidMount() {
    console.log("App CMD");
    const user = auth.getAuthUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    console.log("App render");
    return (
      <>
        <ToastContainer />

        <Navbar user={this.state.user} />
        {/* <div>{}</div> */}
        <main className="container">
          <Provider store={store}>
            <Bugs />
          </Provider>
          <Switch>
            {/* MovieForm元件被保護，需要有user物件才能夠存取元件，否則會被導向loginForm */}
            <ProtectedRoute path="/movies/:id" component={MovieForm} />
            <Route
              path="/movies"
              render={(props) => <Movie user={user} {...props} />}
            />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/customers" component={Customers} />
            <Route path="/rentals" component={Rentals} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </>
    );
  }
}

export default MovieApp;
