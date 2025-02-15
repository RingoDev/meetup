import { User } from "../types/user";

export interface WS_MESSAGE_FROM_SERVER {
  type: typeof MESSAGE | typeof UPDATE_USERS | typeof USER_CREATED;
  msg?: string;
  users?: User[];
  user?: User;
}

export interface WS_MESSAGE_FROM_CLIENT {
  type: typeof CREATE_USER | typeof POST_LOCATION | typeof MESSAGE;
  username?: string;
  msg?: string;
  user?: { _id: string; name: string; latitude: number; longitude: number };
}

export const UPDATE_USERS = "UPDATE_USERS";
export const CREATE_USER = "CREATE_USER";
export const POST_LOCATION = "POST_LOCATION";
export const MESSAGE = "MESSAGE";
export const USER_CREATED = "USER_CREATED";
