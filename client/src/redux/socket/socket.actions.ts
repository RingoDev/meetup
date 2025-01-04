import { createAction } from "@reduxjs/toolkit";

// Action Types
import {
  WS_NEW_MESSAGE,
  WS_CONNECT,
  WS_CREATE_USER,
  WS_DISCONNECT,
  WS_POST_LOCATION,
  WS_SET_CONNECTED,
  WS_SET_DISCONNECTED,
} from "./socket.types";
import { BaseUser } from "../../types/User";

// Action Creators with Explicit Typings

// Set Connected Action
export const setConnected = createAction<void, typeof WS_SET_CONNECTED>(
  WS_SET_CONNECTED,
);

// Set Disconnected Action
export const setDisconnected = createAction<void, typeof WS_SET_DISCONNECTED>(
  WS_SET_DISCONNECTED,
);

// Create User Action
export const createUser = createAction<
  { username: string },
  typeof WS_CREATE_USER
>(WS_CREATE_USER);

// Connect Action
export const connect = createAction<void, typeof WS_CONNECT>(WS_CONNECT);

// Disconnect Action
export const disconnect = createAction<void, typeof WS_DISCONNECT>(
  WS_DISCONNECT,
);

// New Message Action
export const newMessage = createAction<{ msg: string }, typeof WS_NEW_MESSAGE>(
  WS_NEW_MESSAGE,
);

// Post Location Action
export const postLocation = createAction<
  { user: BaseUser },
  typeof WS_POST_LOCATION
>(WS_POST_LOCATION);
