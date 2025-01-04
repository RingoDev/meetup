import { AppUser, MongoUser } from "../../types/User";
import { createReducer } from "@reduxjs/toolkit";
import {
  setLocation,
  setUserChecked,
  setUserID,
  setUsername,
  updateUsers,
} from "./user.actions";
import { LatLng } from "../../types/latLng";
import { calculate } from "../../map/calculate";

const INITIAL_STATE: State = {
  users: [],
  user: {
    name: "NONAME",
  },
};

export interface State {
  users: AppUser[];
  midpoint?: LatLng;
  user: {
    location?: LatLng;
    id?: string;
    name: string;
  };
}

const reducer = createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase(setUsername, (state, action) => {
      state.user.name = action.payload.username
        ? action.payload.username
        : "ERRORNAME";
    })
    .addCase(setLocation, (state, action) => {
      state.user.location = action.payload.location
        ? action.payload.location
        : undefined;
    })
    .addCase(updateUsers, (state, action) => {
      const updatedUsers = setUsersFromDB(
        state.users,
        state.user.id,
        action.payload.users,
        state.user.location,
      );
      state.midpoint = calculate(
        // @ts-expect-error typescript cannot infer that filter filters out undefined
        updatedUsers
          .filter((u) => u.checked)
          .filter((u) => u.latitude !== undefined && u.longitude !== undefined)
          .map((u) => ({ lat: u.latitude, lng: u.longitude })),
        "minDistance",
      );

      state.users = updatedUsers;
    })
    .addCase(setUserChecked, (state, action) => {
      const updatedUsers = setUserCheckedUtil(
        state.users,
        action.payload.user,
        action.payload.checked,
      );

      state.midpoint = calculate(
        // @ts-expect-error typescript cannot infer that filter filters out undefined
        updatedUsers
          .filter((u) => u.checked)
          .filter((u) => u.latitude !== undefined && u.longitude !== undefined)
          .map((u) => ({ lat: u.latitude, lng: u.longitude })),
        "minDistance",
      );

      state.users = updatedUsers;
    })
    .addCase(setUserID, (state, action) => {
      state.user.id = action.payload.userID;
    });
});

function setUserCheckedUtil(
  users: AppUser[],
  user?: AppUser,
  checked?: boolean,
) {
  if (!user || checked === undefined) return users;

  const result: AppUser[] = [];
  for (const u of users) {
    if (u._id === user._id) {
      result.push({ ...u, checked: checked });
    } else {
      result.push({ ...u });
    }
  }
  return result;
}

function setUsersFromDB(
  users: AppUser[],
  id?: string,
  newUsers?: MongoUser[],
  location?: LatLng,
) {
  if (!newUsers) return users;

  const result: AppUser[] = [];
  for (const newUser of newUsers) {
    const correspondingUser: AppUser | undefined = getUser(newUser, users);
    if (correspondingUser) {
      // user exists already
      result.push({
        ...correspondingUser,
        latitude: newUser.latitude,
        longitude: newUser.longitude,
      });
    } else {
      // user doesn't exist yet
      if (validateDocument(newUser)) {
        if (newUser._id === id) {
          // this is me
          result.push({
            ...newUser,
            checked: true,
            groupID: 0,
            isMain: true,
          });
        } else {
          result.push({
            ...newUser,
            checked: true,
            groupID: -1,
            isMain: false,
          });
        }
      } else if (newUser._id === id && location) {
        // we want to display this user as early as possible
        result.push({
          ...newUser,
          checked: true,
          groupID: 0,
          isMain: true,
          latitude: location.lat,
          longitude: location.lng,
        });
      }
    }
  }
  return result;
}

function getUser(newUser: MongoUser, users: AppUser[]) {
  for (const user of users) {
    if (user._id === newUser._id) return user;
  }
}

function validateDocument(doc: MongoUser): boolean {
  if (doc.name === undefined || doc._id === undefined) return false;
  if (doc.latitude === undefined || doc.longitude === undefined) return true;
  if (doc.latitude < -90 || doc.latitude > 90) return false;
  if (doc.longitude < -180 || doc.latitude > 180) return false;
  return true;
}

export const getUsers = (state: State) => state.users;

export const getLocation = (state: State) => state.user.location;
export const getUsername = (state: State) => {
  return state.user.name;
};
export const getUserID = (state: State) => state.user.id;
export const getMidpoint = (state: State) => state.midpoint;

export default reducer;
