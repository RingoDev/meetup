import { useEffect, useState } from "react";
import { DivIcon, Map, Marker } from "leaflet";
import { useSelector } from "react-redux";
import { getUsers } from "../redux/user/user.reducer";
import { AppUser } from "../types/User";

interface UserMarker {
  marker: Marker;
  user: AppUser;
}

function useUserMarkers(map: Map) {
  const [userMarkers, setUserMarkers] = useState<UserMarker[]>([]);
  const users = useSelector(getUsers);

  useEffect(() => {
    // we are re-rendering -> users changed
    for (const userMarker of userMarkers) {
      userMarker.marker.remove();
    }
    setUserMarkers([]);

    const updatedUserMarkers = [];

    // adding users to map
    for (const user of users) {
      if (user.latitude && user.longitude && user.checked) {
        const markerIcon = document.createElement("i");
        markerIcon.className = "marker fas fa-map-marker-alt fa-3x";

        if (user.isMain) {
          markerIcon.id = "self-marker";
        }
        const icon = new DivIcon({ html: markerIcon });
        console.log(user.name, user.longitude, user.latitude);
        const marker = new Marker(
          { lng: user.longitude, lat: user.latitude },
          { riseOnHover: true },
        )
          .setIcon(icon)
          .addTo(map);
        marker.bindTooltip(user.name);
        marker.addEventListener(
          "mouseover",
          () => {
            console.log("hover");
            marker.openTooltip();
          },
          false,
        );

        const userMarker: UserMarker = {
          user: user,
          marker: marker,
        };

        // add userMarker to userMarkers
        updatedUserMarkers.push(userMarker);
        setUserMarkers(updatedUserMarkers);
      }
    }

    return () => {
      userMarkers.forEach((m) => m.marker.removeFrom(map));
    };
  }, [users]);
}

export default useUserMarkers;
