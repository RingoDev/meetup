import React from "react";
import "./Users.css";

import UserComponent from "./User";
import { useSelector } from "react-redux";
import { getUsers } from "../redux/user/user.reducer";

const Users = () => {
  const users = useSelector(getUsers);

  return (
    <>
      <table>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user._id}>
                <UserComponent user={user} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Users;
