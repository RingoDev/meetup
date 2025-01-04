import { useSelector } from "react-redux";
import { setLocation } from "../redux/user/user.actions";
import { getUserID } from "../redux/user/user.reducer";
import { postLocation } from "../redux/socket/socket.actions";
import useActionDispatch from "./useActionDispatch";
import { useEffect } from "react";

function useLocation(username: string) {
  const postLocationDispatch = useActionDispatch(postLocation);
  const setLocationDispatch = useActionDispatch(setLocation);

  const userID = useSelector(getUserID); // userId is required for most actions - maybe make it a prop?

  useEffect(() => {
    const interval = navigator.geolocation.watchPosition(
      (position) => {
        console.debug("Updated position", position);
        setLocationDispatch({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
        if (userID) {
          postLocationDispatch({
            user: {
              _id: userID,
              name: username,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        } else {
          console.info(
            "We don't have a user id and cannot post location to backend yet",
          );
        }
      },
      (error) => {
        console.info("Error getting location", error);
      },
      { timeout: 5000, enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(interval);
  }, [userID, username]);
}

export default useLocation;
