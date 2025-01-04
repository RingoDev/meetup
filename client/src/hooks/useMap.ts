import { useEffect, useState } from "react";
import { Map, TileLayer } from "leaflet";

function useMap(mapContainerRef: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<Map>();
  useEffect(() => {
    if (mapContainerRef.current === null) return;
    const myMap = new Map(mapContainerRef.current, {
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      // style: "mapbox://styles/mapbox/dark-v10",
      center: [48.33830196724644, 14.317141245631463],
      zoom: 9,
    });
    new TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(myMap);
    setMap(myMap);
    return () => {
      if (map) map.remove();
    };
  }, [mapContainerRef]);
  return map;
}

export default useMap;
