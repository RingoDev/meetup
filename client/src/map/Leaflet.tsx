import React, {useRef, useEffect, useState} from "react";
import "./Map.css";
import {AppUser} from "../data/User";
import {RootState} from "../redux/rootReducer";
import {getSortedUsers, getUsers} from "../redux/user/user.reducer";
import {ThunkDispatch} from "redux-thunk";
import {connect, ConnectedProps} from "react-redux";
import {calculate} from "./calculate";
import {Marker, Map, Popup, Icon, DivIcon, TileLayer} from "leaflet";
import "leaflet/dist/leaflet.css";


interface MapProps {
}

interface UserMarker {
    marker: Marker,
    user: AppUser
}


type PropsFromRedux = ConnectedProps<typeof connector> & MapProps


const Leaflet: React.FC<PropsFromRedux> = (props) => {

    const mapContainerRef = useRef<HTMLDivElement>(null);
    // const popUpRef = useRef(new mapboxgl.Popup({offset: 15}));
    const [map, setMap] = useState<Map>()
    const [userMarkers, setUserMarkers] = useState<UserMarker[]>([])
    const [midMarker, setMidMarker] = useState<{ marker: Marker, popUp: Popup }>();

    // initialize map when component mounts
    useEffect(() => {

        const myMap = new Map(mapContainerRef.current ? mapContainerRef.current : 'map', {
            // See style options here: https://docs.mapbox.com/api/maps/#styles
            // style: "mapbox://styles/mapbox/dark-v10",
            center: [48.33830196724644,14.317141245631463],
            zoom: 12
        });

        new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(myMap);
        setMap(myMap)

        // add navigation control (zoom buttons)
        // map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
        // clean up on unmount
        return () => {
            if (map) map.remove();
        }
    }, []);// eslint-disable-line


    if (map) {

        // users that have an old marker on the map but are no longer in the users array must be removed too.
        for (let userMarker of userMarkers) {
            // user is not in users but still has a marker on the map
            if (!props.users.map(user => user._id).includes(userMarker.user._id)) {
                //remove from map and from userMarkers array
                userMarker.marker.remove();
                setUserMarkers(userMarkers.filter(um => um.user._id !== userMarker.user._id))
            }
        }

        // adding/removing users to/from map
        for (let user of props.users) {
            if (user.latitude && user.longitude) {
                let foundMarker = false;
                for (let userMarker of userMarkers) {
                    if (userMarker.user._id === user._id) {
                        //user is unchecked so remove marker from array and map
                        if (!user.checked) {
                            userMarker.marker.remove()
                            setUserMarkers(userMarkers.filter(m => m.user._id !== user._id))
                            break;
                        }
                        foundMarker = true;
                        userMarker.marker.setLatLng({lng: user.longitude, lat: user.latitude})
                        break;
                    }
                }
                if (!foundMarker && user.checked) {
                    const popUp = new Popup().setPopupContent(user.name)
                    // create a marker for user

                    const markerIcon = document.createElement("i")
                    markerIcon.className = "marker fas fa-map-marker-alt fa-3x"

                    if (user.isMain) {
                        markerIcon.id = "main-marker"
                        markerIcon.className = "marker fas fa-map-marker-alt fa-4x"
                    }

                    const icon = new DivIcon({html: markerIcon})
                    console.log(user.name, user.longitude, user.latitude)
                    const marker = new Marker({lng: user.longitude, lat: user.latitude})
                        .setIcon(icon)
                        .setPopupContent(popUp)
                        .addTo(map)

                    const userMarker: UserMarker = {
                        user: user,
                        marker: marker
                    }
                    // add userMarker to userMarkers
                    userMarkers.push(userMarker)
                    setUserMarkers(userMarkers)
                }
            }
        }

        // calculate midpoint
        const response = calculate(props.users.filter(u => u.checked).map(u => {
            return {latitude: u.latitude, longitude: u.longitude}
        }), "minDistance")
        if (midMarker) {
            if (response) {
                // change marker
                midMarker.marker.setLatLng({lng: response.longitude, lat: response.latitude})
                midMarker.popUp.setPopupContent(response.longitude + '\n' + response.latitude)
            } else {
                // remove marker from map
                midMarker.popUp.remove();
                midMarker.marker.remove()
                //    remove marker from state
                setMidMarker(undefined)
            }
        } else {
            if (response) {
                //create popup
                const popUp = new Popup().setPopupContent(response.longitude + '\n' + response.latitude)
                //create marker
                const markerIcon = document.createElement("i")
                markerIcon.id = "mid-point"
                markerIcon.className = "marker middle-point fas fa-map-marker-alt fa-5x"
                const icon = new DivIcon({html: markerIcon})
                const marker = new Marker({lng: response.longitude, lat: response.latitude})
                    .setIcon(icon)
                    .addTo(map)

                marker.setPopupContent(popUp)
                setMidMarker({marker, popUp})
            }
        }
    }
    return <div className="map" ref={mapContainerRef} id={'map'}/>;
};


const mapStateToProps = (state: RootState) => {
    return {
        users: getUsers(state.user),
        sortedUsers: getSortedUsers(state.user)
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
    return {}

}

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Leaflet)
