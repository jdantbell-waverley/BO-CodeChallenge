import React, { useEffect, useRef } from 'react';
import { Circle, MapContainer, TileLayer } from 'react-leaflet';

import Markers from './marker/Marker';

import 'leaflet/dist/leaflet.css';
import './Map.css';

const Map = ({
  results = [],
  selectedItem = { latitude: '', longitude: '' },
  userPosition,
  hiddenUserForm,
  markerPosition,
  setMarkerPosition,
  circle,
  setCircle,
  onItemSelect = () => {},
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!selectedItem?.latitude || !selectedItem?.longitude || !mapRef.current)
      return;

    const { latitude, longitude } = selectedItem;
    // @ts-ignore
    mapRef.current.target.flyTo({ lat: latitude, lng: longitude }, 15);
  }, [selectedItem, selectedItem?.latitude, selectedItem?.longitude]);

  useEffect(() => {
    if (!results.length || !mapRef.current) return;

    const { latitude, longitude } = results[0];

    // @ts-ignore
    mapRef.current.target.flyTo({ lat: latitude, lng: longitude });

    // Removing the map markers from keyboard flow
    // @ts-ignore
    const mapElement = mapRef.current.target._container;
    const mapMarkersElements = mapElement.getElementsByClassName(
      'leaflet-marker-icon',
    );

    Object.values(mapMarkersElements).forEach((markerElement) =>
      markerElement.setAttribute('tabindex', '-1'),
    );
  }, [results]);

  useEffect(() => {
    if (!mapRef.current) return;

    // @ts-ignore
    mapRef.current.target.on({
      click: function () {
        onItemSelect();
      },
      popupopen: function (event) {
        // When a popup is opened, then the focus is going to the PopUp, so it's easy to find
        const popUpElement = event.popup._container;
        const popUpCloseButton = popUpElement.getElementsByClassName(
          'leaflet-popup-close-button',
        )[0];

        popUpElement.setAttribute('tabindex', '2');
        popUpCloseButton.setAttribute('tabIndex', '2');
        popUpElement.focus();
      },
      popupclose: () => {
        // When the popup is closed, then the focus is going to the list, so navigate is easy
        const selectedElement = document.getElementById('result-selected');
        const searchBar = document.getElementById('searchInput');

        if (selectedElement) return selectedElement.focus();
        if (searchBar) return searchBar.focus();
      },
    });

    // Removing the map container from keyboard flow
    // @ts-ignore
    const mapElement = mapRef.current.target._container;
    mapElement.setAttribute('tabindex', '-1');

    // Moving Zoom in / Zoom out buttons to the last steps in keyboard flow
    const mapZoomPanel = mapElement.getElementsByClassName(
      'leaflet-control-zoom',
    )[0];
    const zoomButtons = mapZoomPanel.getElementsByTagName('a');

    Object.values(zoomButtons).forEach((zoomButton) =>
      zoomButton.setAttribute('tabindex', '3'),
    );

    // Moving attribution credits to the last steps in the keyboard
    const attributionPanelElements = mapElement.querySelectorAll(
      '.leaflet-control-attribution > *',
    );
    Object.values(attributionPanelElements).forEach((panelElement) =>
      panelElement.setAttribute('tabindex', '4'),
    );
  }, []);

  return (
    <div>
      <MapContainer
        className="map"
        center={userPosition}
        zoom={3}
        whenReady={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={circle.center} radius={circle.radius} />
        <Markers
          results={results}
          setCircle={setCircle}
          onItemSelect={onItemSelect}
          selectedItem={selectedItem}
          hiddenUserForm={hiddenUserForm}
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
