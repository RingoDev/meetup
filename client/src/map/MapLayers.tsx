import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import { AppUser } from "../types/User";
import { getMidpoint, getUsers } from "../redux/user/user.reducer";
import { useSelector } from "react-redux";
import { DivIcon, Map, Marker, Popup, TileLayer, Tooltip } from "leaflet";
import "leaflet/dist/leaflet.css";
import useMap from "../hooks/useMap";
import useMidMarker from "../hooks/useMidmarker";
import useUserMarkers from "../hooks/useUserMarkers";

interface MapLayersProps {
  map: Map;
}

const MapLayers: React.FC<MapLayersProps> = ({ map }) => {
  useMidMarker(map);
  useUserMarkers(map);
  return <></>;
};
export default MapLayers;
