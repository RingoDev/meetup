import React from "react";
import Leaflet from "../map/Leaflet";
import Users from "../users/Users";
import { useSelector } from "react-redux";
import { getLocation, getUsername } from "../redux/user/user.reducer";
import "./App.css";
import useLocation from "../hooks/useLocation";

const App = () => {
  const username = useSelector(getUsername);
  const location = useSelector(getLocation);

  useLocation(username);

  return (
    <>
      <div className="App">
        {location ? (
          <></>
        ) : (
          <div>You have to activate Location Services to use this App</div>
        )}
        <div id={"container"}>
          <div id={"map-container"}>
            <Leaflet />
          </div>
          <div id={"userContainer"} className={"p-5"}>
            <Users />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
