import { Middleware, MiddlewareAPI } from "redux";
import {
  WS_CONNECT,
  WS_CREATE_USER,
  WS_DISCONNECT,
  WS_NEW_MESSAGE,
  WS_POST_LOCATION,
} from "./socket.types";
import {
  connect,
  createUser,
  disconnect,
  newMessage,
  postLocation,
  setConnected,
  setDisconnected,
} from "./socket.actions";
import { setUserID, updateUsers } from "../user/user.actions";
import { WS_URL } from "./config";
import {
  CREATE_USER,
  MESSAGE,
  POST_LOCATION,
  UPDATE_USERS,
  USER_CREATED,
  WS_MESSAGE_FROM_CLIENT,
  WS_MESSAGE_FROM_SERVER,
} from "./messageTypes";
import { isAnyOf } from "@reduxjs/toolkit";

let socket: WebSocket | null = null;

const onOpen = (store: MiddlewareAPI) => {
  return (event: Event) => {
    if (event.target === null) {
      console.info("Event target was null");
    } else {
      console.info("Websocket opened succesfully", event.target);
      store.dispatch(setConnected());
    }
  };
};

const onClose = (store: MiddlewareAPI) => (event: CloseEvent) => {
  console.info("Websocket was closed", event);
  store.dispatch(setDisconnected());
};

/**
 * Handles incoming WebSocket messages from the server and dispatches appropriate actions to the Redux store.
 *
 * This function acts as a WebSocket message event handler. It processes the JSON types received from the server,
 * determines the type of message, and performs corresponding Redux actions. Supported message types include
 * updating the list of users and handling a newly created user.
 *
 * @param store - The Redux middleware API, which provides access to the `dispatch` method for dispatching actions to the store.
 * @returns A function that processes a WebSocket message event.
 */
const onMessage = (store: MiddlewareAPI) => (event: MessageEvent<string>) => {
  const data: WS_MESSAGE_FROM_SERVER = JSON.parse(event.data); // todo unsafe validate typings
  console.info("Websocket: Receiving server message", event);
  switch (data.type) {
    case UPDATE_USERS:
      if (data.users) store.dispatch(updateUsers({ users: data.users }));
      break;
    case USER_CREATED:
      if (data.user) {
        store.dispatch(setUserID({ userID: data.user._id }));
      }
      break;
    default:
      console.log("No action for ", data.type);
      break;
  }
};

const socketMiddleware: Middleware = (api) => (next) => (action) => {
  const sendMessage = (msg: WS_MESSAGE_FROM_CLIENT) => {
    if (socket !== null) socket.send(JSON.stringify(msg));
    else console.log("Socket was null, couldn't send message");
  };

  if (
    !isAnyOf(connect, disconnect, postLocation, createUser, newMessage)(action)
  ) {
    console.debug("Passing through WS middleware to next action:", action);
    return next(action);
  }

  switch (action.type) {
    case WS_CONNECT:
      if (socket !== null) {
        socket.close();
      }

      if (!WS_URL) throw new Error("Websocket is not configured");

      // connect to the remote host
      socket = new WebSocket(WS_URL);

      // websocket handlers
      socket.onmessage = onMessage(api);
      socket.onclose = onClose(api);
      socket.onopen = onOpen(api);

      break;
    case WS_DISCONNECT:
      //todo try to reconnect if connection is lost
      if (socket !== null) {
        socket.close();
      }
      socket = null;
      console.log("websocket closed");
      break;
    case WS_NEW_MESSAGE:
      console.log("sending a message", action.payload.msg);
      sendMessage({ type: MESSAGE, msg: action.payload.msg });
      break;
    case WS_POST_LOCATION:
      console.log("Posting my Location", action.payload.user);
      sendMessage({ type: POST_LOCATION, user: action.payload.user });
      break;
    case WS_CREATE_USER:
      console.log("Creating a new User", action.payload.username);
      sendMessage({ type: CREATE_USER, username: action.payload.username });
      break;

    default:
      console.log("the next action:", action);
      return next(action);
  }
};

export default socketMiddleware;
