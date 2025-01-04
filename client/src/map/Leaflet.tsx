import React, { useRef } from "react";
import "./Map.css";
import "leaflet/dist/leaflet.css";
import useMap from "../hooks/useMap";
import MapLayers from "./MapLayers";

const Leaflet = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);
  console.log("Rendering map");
  return (
    <>
      <div className="map" ref={mapContainerRef} id={"map"} />
      {map ? <MapLayers map={map} /> : <></>}
    </>
  );
};
export default Leaflet;
