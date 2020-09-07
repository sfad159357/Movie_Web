// third-parties package
import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Component
import Movie from "./components/Movie";
import MovieForm from "./components/MovieForm";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Logout from "./components/Logout";
import Navbar from "./components/common/Navbar";
import Customers from "./components/route/Customers";
import Rentals from "./components/route/Rentals";
import NotFound from "./components/route/NotFound";
import auth from "./components/service/authService";
import ProtectedRoute from "./components/common/ProtectedRoute";

// css
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

export class MovieApp extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getAuthUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      <>
        <ToastContainer />
        <Navbar user={this.state.user} />
        <main className="container">
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
