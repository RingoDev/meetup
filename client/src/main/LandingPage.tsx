import App from "./App";
import React, { useEffect, useState } from "react";
import "./landingPage.css";
import { useSelector } from "react-redux";
import { getUsername } from "../redux/user/user.reducer";
import { setUsername } from "../redux/user/user.actions";
import { connect, createUser } from "../redux/socket/socket.actions";
import useActionDispatch from "../hooks/useActionDispatch";

const LandingPage = () => {
  const [tempName, setTempName] = useState<string>("");

  const setUsernameDispatch = useActionDispatch(setUsername);
  const createUserDispatch = useActionDispatch(createUser);
  const wsConnectDispatch = useActionDispatch(connect);

  const username = useSelector(getUsername);

  const submitName = (name: string) => {
    if (name.trim() !== "") {
      setUsernameDispatch({ username: name.trim() });
      createUserDispatch({ username: name.trim() });
    }
  };

  useEffect(() => {
    wsConnectDispatch(undefined);
  }, []);

  return (
    <>
      <h1 className={"center"} style={{ color: "white" }}>
        Meet<span style={{ color: "rgb(255, 179, 0)" }}>Up</span>
      </h1>
      {username !== "NONAME" ? (
        <App />
      ) : (
        <div id={"landingContainer"} className={"container"}>
          <div id={"landingcard"} className={"card grey darken-1"}>
            <div className={"card-content"}>
              <span className="card-title">Choose a Name</span>
            </div>
            <div className={"card-action"}>
              <div id={"chooseName"}>
                <input
                  id={"nameInput"}
                  onChange={(e) => setTempName(e.target.value)}
                  type={"text"}
                />
                <button
                  id={"nameSubmit"}
                  className={
                    "waves-effect waves-light btn amber darken-1 center"
                  }
                  onClick={() => submitName(tempName)}
                >
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;
