import React, { useState, useEffect } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const MapView = () => {
  const [position, setPosition] = useState([45, 45]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
    })
  }, [])
  return (
    <Map center={position} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <Marker position={position}>
        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
      </Marker>
    </Map>
  );
}

const App = () => {
  return (
      <div className="row">
        <div className="col-md-2">
        </div>
        <div className="col-sm-12 col-md-8">
          <MapView />
        </div>
        <div className="col-md-2">
        </div>
      </div>
  );
}

export default App;
