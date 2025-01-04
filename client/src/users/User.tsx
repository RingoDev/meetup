import React from "react";
import { AppUser } from "../types/User";
import "./User.css";
import { setUserChecked } from "../redux/user/user.actions";
import { useDispatch } from "react-redux";

interface UserProps {
  user: AppUser;
}

const User = (props: UserProps) => {
  const dispatch = useDispatch();

  return (
    <>
      <td
        className={props.user.isMain ? "mainUser" : "normalUser"}
        id={"userWrapper"}
      >
        <div>{props.user.name}</div>
        <div>
          <div className="switch">
            <label>
              <input
                disabled={!props.user.longitude}
                checked={props.user.checked}
                onChange={(event) =>
                  dispatch(
                    setUserChecked({
                      user: props.user,
                      checked: event.target.checked,
                    }),
                  )
                }
                type="checkbox"
              />
              <span className="lever" />
            </label>
          </div>
        </div>
      </td>
    </>
  );
};

export default User;
