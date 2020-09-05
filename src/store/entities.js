import { combineReducers } from "redux";
import projectsReducer from "./projects";
import bugsReducer from "./bugs";
import UsersReducer from "./users";

export default combineReducers({
  projects: projectsReducer,
  bugs: bugsReducer,
  users: UsersReducer,
});
