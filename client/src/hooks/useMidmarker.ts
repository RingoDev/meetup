import { useEffect, useState } from "react";
import { DivIcon, Map, Marker, Tooltip } from "leaflet";
import { useSelector } from "react-redux";
import { getMidpoint } from "../redux/user/user.reducer";

function useMidMarker(map: Map) {
  const [midMarker, setMidMarker] = useState<Marker>();
  const midpoint = useSelector(getMidpoint);

  useEffect(() => {
    if (midpoint === undefined) return;

    // we are re-rendering -> midpoint changed
    // remove any old midMarker
    midMarker?.removeFrom(map);
    setMidMarker(undefined);

    // create new marker
    const markerIcon = document.createElement("i");
    markerIcon.id = "mid-point";
    markerIcon.className = "marker middle-point fas fa-map-marker-alt fa-5x";
    const icon = new DivIcon({ html: markerIcon });
    const marker = new Marker(midpoint, { riseOnHover: true })
      .setIcon(icon)
      .addTo(map);
    marker.bindTooltip(`${midpoint.lat}\n${midpoint.lng}`);
    marker.addEventListener(
      "mouseover",
      () => {
        console.log("hover");
        marker.openTooltip();
      },
      false,
    );

    setMidMarker(marker);

    return () => {
      midMarker?.removeFrom(map);
    };
  }, [midpoint]);
}

export default useMidMarker;
