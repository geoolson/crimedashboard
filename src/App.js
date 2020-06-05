import React, { useState, useEffect } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const Header = props => {
  const {position, setPosition} = props;
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        Crime Data Statistics
      </Navbar.Brand>
      <Nav className="mr-auto">
      </Nav>
      <Form inline
        onSubmit={e => {
          e.preventDefault();
          const zipCode = document.getElementById('zip_field').value;
          fetch('http://localhost:8080/search/' + zipCode)
            .then(resp => resp.json())
            .then(data =>{
              setPosition(data);
            });
        }} 
      >
        <FormControl id="zip_field" type="text" placeholder="Zip Code" className="mr-sm-2" />
        <Button type="submit" variant="outline-info">
          Search
        </Button>
      </Form>
    </Navbar>
  );
}

const MapView = props => {
  const {position, setPosition} = props;
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
        <Popup>Current Location</Popup>
      </Marker>
    </Map>
  );
}

const App = () => {
  const [position, setPosition] = useState([45, 45]);
  return (
    <>
      <Header
        position={position}
        setPosition={setPosition}
      />
      <div className="row bg-secondary mt-3">
        <div className="col-md-2">
        </div>
        <div className="col-sm-12 col-md-8">
          <MapView
            position={position}
            setPosition={setPosition}
          />
        </div>
        <div className="col-md-2">
        </div>
      </div>
      <footer className="text-muted bg-dark fixed-bottom">
        <div className="container">
          <p className="float-right">
            <a href="#">Back to top</a>
          </p>
          <p>Author: Geoffrey Olson ©2020</p>
        </div>
      </footer>
    </>
  );
}

export default App;
