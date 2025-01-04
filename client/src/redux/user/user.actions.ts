import { createAction } from "@reduxjs/toolkit";
import {
  SET_LOCATION,
  SET_USER_CHECKED,
  SET_USER_ID,
  SET_USERNAME,
  UPDATE_USERS,
} from "./user.types";
import { AppUser, MongoUser } from "../../types/User";
import { LatLng } from "../../types/latLng";

// Set User Checked Action
export const setUserChecked = createAction<
  { user: AppUser; checked: boolean },
  typeof SET_USER_CHECKED
>(SET_USER_CHECKED);

// Set Username Action
export const setUsername = createAction<
  { username: string },
  typeof SET_USERNAME
>(SET_USERNAME);

// Set Location Action
export const setLocation = createAction<
  { location: LatLng },
  typeof SET_LOCATION
>(SET_LOCATION);

// Update Users Action
export const updateUsers = createAction<
  { users: MongoUser[] },
  typeof UPDATE_USERS
>(UPDATE_USERS);

// Set User ID Action
export const setUserID = createAction<{ userID: string }, typeof SET_USER_ID>(
  SET_USER_ID,
);
