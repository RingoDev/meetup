import {
  SET_LOCATION,
  SET_USER_CHECKED,
  SET_USER_ID,
  SET_USERNAME,
  UPDATE_USERS,
} from "./user.types";
import { AxiosError } from "axios";
import { MongoUser, AppUser } from "../../data/User";

const INITIAL_STATE: userState = {
  fetchUsersPending: false,
  users: [],
  fetchUsersError: undefined,
  postLocationPending: false,
  location: undefined,
  userID: undefined,
  username: "NONAME",
  postLocationError: undefined,
};

export interface userState {
  fetchUsersPending: boolean;
  users: AppUser[];
  fetchUsersError: AxiosError | undefined;
  postLocationPending: boolean;
  location: GeolocationPosition | undefined;
  userID: string | undefined;
  username: string;
  postLocationError: AxiosError | undefined;
}

const reducer = (
  state = INITIAL_STATE,
  action: {
    type: string;
    error?: AxiosError;
    users?: MongoUser[];
    userID?: string;
    user?: AppUser;
    checked?: boolean;
    username?: string;
    location?: GeolocationPosition;
  },
): typeof INITIAL_STATE => {
  console.log(action);

  switch (action.type) {
    case SET_USERNAME: {
      return {
        ...state,
        username: action.username ? action.username : "ERRORNAME",
      };
    }
    case SET_LOCATION: {
      return {
        ...state,
        location: action.location ? action.location : undefined,
      };
    }

    case UPDATE_USERS:
      console.log("Fetched users", action.users);
      return {
        ...state,
        users: setUsersFromDB(
          state.users,
          state.userID,
          action.users,
          state.location,
        ),
      };

    case SET_USER_CHECKED:
      return {
        ...state,
        users: setUserChecked(state.users, action.user, action.checked),
      };
    case SET_USER_ID:
      return {
        ...state,
        userID: action.userID,
      };
    default:
      return state;
  }
};

function setUserChecked(users: AppUser[], user?: AppUser, checked?: boolean) {
  if (!user || checked === undefined) return users;

  const result: AppUser[] = [];
  for (let u of users) {
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
  location?: GeolocationPosition,
) {
  if (!newUsers) return users;

  const result: AppUser[] = [];
  for (let newUser of newUsers) {
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
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    }
  }
  console.log("The result", result);
  return result;
}

function getUser(newUser: MongoUser, users: AppUser[]) {
  for (let user of users) {
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

export const getUsers = (state: userState) => state.users;
export const getSortedUsers = (state: userState) =>
  state.users.slice().sort((u1, u2) => {
    if (u1.isMain) return -1;
    else if (u2.isMain) return 1;
    else return u1.name.localeCompare(u2.name);
  });

export const getUsersPending = (state: userState) => state.fetchUsersPending;
export const getUsersError = (state: userState) => state.fetchUsersError;
export const getLocation = (state: userState) => state.location;
export const getUsername = (state: userState) => {
  if (state === undefined) console.log("HEY");
  return state.username;
};

export const getUserID = (state: userState) => state.userID;
export const getLocationPending = (state: userState) =>
  state.postLocationPending;
export const getLocationError = (state: userState) => state.postLocationError;

export default reducer;
