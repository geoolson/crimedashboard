import React, { useState, useEffect } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Modal, Navbar, Nav, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import { Doughnut, Line } from 'react-chartjs-2'

const url = "http://localhost:8080/";

var selectedAgency = 0;
var agencies = [];

const aggData = (selected) => {
  try {

    let drugs = Array(12).fill(0);
    agencies[selectedAgency].results.forEach((elem, curr) => {
      const month = elem.month_num -1;
      drugs[month] = elem.drug_abuse_gt;
    });
    graphData.datasets[0].data = drugs;
  }
  catch (e) {
    return;
  }
};

const graphData = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  datasets: [
    {
      label: 'drug abuses',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    },
  ]
};


const Stats = props => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Reported Arrests:</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {aggData(selectedAgency)}
          <Line data={graphData} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const Header = props => {
  const { setPosition } = props;
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
          fetch(url + 'search/' + zipCode)
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
  useEffect(()=>{
      const [latitude, longitude] = position;
      fetch(`${url}api/${latitude}/${longitude}/${props.year}`)
        .then(resp => resp.json())
        .then(data =>{
          const result = data
              .filter(elem => {
                if (elem.results.length > 0) {
                  return true;
                }
                else {
                  return false;
                }
              })
              .map((elem, idx) => {
                agencies = [...agencies, elem];
                return (
                  <Marker
                    onclick={() => { 
                      props.setModalShow(true);
                      selectedAgency = (()=> idx)(idx);
                    }}
                    position={[elem.location.lat, elem.location.lng]}
                  >
                    {/*
                    <Popup>agency
                      {JSON.stringify(elem.location)}
                    </Popup>
                    */}
                  </Marker>
                )
              })
          props.setMarker(result);
        });
  }, [position, props.year]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
    })
  }, []);
  return (
    <Map center={position} zoom={10}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      {/*
      <Marker position={position}>
        <Popup>Current Location</Popup>
      </Marker>
      */}
      {props.marker}
    </Map>
  );
}

const App = () => {
  const [position, setPosition] = useState([45, 45]);
  const [marker, setMarker] = useState([]);
  const [year, setYear] = useState(2018);
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Header
        position={position}
        setPosition={setPosition}
      />
      <Stats
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <div className="row bg-secondary mt-3">
        <div className="col-md-2">
        </div>
        <div className="col-sm-12 col-md-8">
          <Dropdown className="mb-2">
            <Dropdown.Toggle
              className="dark"
              variant="success"
              id="dropdown-basic"
            >
              {year}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {setYear(2019)}}>2019</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2018)}}>2018</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2017)}}>2017</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2016)}}>2016</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2015)}}>2015</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2014)}}>2014</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2013)}}>2013</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2012)}}>2012</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2011)}}>2011</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2010)}}>2010</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2009)}}>2009</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2008)}}>2008</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2007)}}>2007</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2006)}}>2006</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2005)}}>2005</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2004)}}>2004</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2003)}}>2003</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2002)}}>2002</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2001)}}>2001</Dropdown.Item>
              <Dropdown.Item onClick={() => {setYear(2000)}}>2000</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <MapView
            position={position}
            setPosition={setPosition}
            marker={marker}
            setMarker={setMarker}
            year={year}
            setModalShow={setModalShow}
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
