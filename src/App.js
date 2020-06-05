import React, { useState, useEffect } from 'react';
import {
  Map,
  Marker,
  TileLayer,
  Circle
} from 'react-leaflet';
import {
  Modal,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Dropdown
} from 'react-bootstrap';
import { Line } from 'react-chartjs-2'

const url = "http://localhost:8080/";

// 8 for portland at 97006
var selectedAgency = 0;
var agencies = [];


const annualArrests = (agency) => {
  /*  This is a sample of what a result is 
  aggravated_assault: 0
  all_other_offenses: 22
  arson: 0
  burglary: 0
  csv_header: null
  curfew: 0
  data_year: 2018
  disorderly: 4
  driving: 8
  drug_abuse_gt: 1
  drug_poss_m: 0
  drug_poss_opium: 0
  drug_poss_other: 1
  drug_poss_subtotal: 1
  drug_poss_synthetic: 0
  drug_sales_m: 0
  drug_sales_opium: 0
  drug_sales_other: 0
  drug_sales_subtotal: 0
  drug_sales_synthetic: 0
  drunkness: 0
  embezzlement: 0
  forgery: 0
  fraud: 0
  g_all: 0
  g_b: 0
  g_n: 0
  g_t: 0
  ht_c_s_a: 0
  ht_i_s: 0
  larceny: 0
  liquor: 0
  manslaughter: 0
  month_num: 1
  murder: 0
  mvt: 0
  offense_family: 0
  prostitution: 0
  prostitution_a_p_p: 0
  prostitution_p: 0
  prostitution_p_p: 0
  rape: 1
  robbery: 0
  sex_offense: 0
  simple_assault: 3
  stolen_property: 0
  suspicion: 0
  vagrancy: 0
  vandalism: 2
  weapons: 0
  */

  // these keys need to be filtered out to calculate the aggragate
  const filters = new Set([
    'csv_header',
    'g_all',
    'g_b',
    'g_n',
    'g_t',
    'drug_abuse_gt',
    'drug_poss_subtotal',
    'data_year',
    'month_num',
  ]);
  let sumCrimes = 0;
  agency.results.forEach(month => {
    Object.keys(month).forEach((key) => {
      if (!filters.has(key)) {
        sumCrimes += month[key];
      }
    });
  });
  return sumCrimes;
}


const aggData = (selected) => {
  try {
    let drugs = Array(12).fill(0);
    let manslaughter = Array(12).fill(0);
    let murder = Array(12).fill(0);
    let other = Array(12).fill(0);
    let weapons = Array(12).fill(0);
    let assault = Array(12).fill(0);
    agencies[selectedAgency].results.forEach((elem, curr) => {
      const month = elem.month_num - 1;
      drugs[month] = elem.drug_abuse_gt;
      manslaughter[month] = elem.manslaughter;
      murder[month] = elem.murder;
      other[month] = elem.all_other_offenses;
      weapons[month] = elem.weapons;
      assault[month] = elem.aggravated_assault;
    });
    graphData.datasets[0].data = drugs;
    graphData.datasets[1].data = murder;
    graphData.datasets[2].data = other;
    graphData.datasets[3].data = weapons;
    graphData.datasets[4].data = manslaughter;
    graphData.datasets[5].data = assault;
    return graphData;
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
      label: 'Drug Abuses',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(40, 138, 78,0.4)',
      borderColor: 'rgba(40, 138, 78,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(40, 138, 78,1)',
      pointBackgroundColor: 'rgba(40, 138, 78,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(40, 138, 78,1)',
      pointHoverBorderColor: 'rgba(40, 138, 78,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    },
    {
      label: 'Murder',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(255,0,0)',
      borderColor: 'rgba(255,0,0)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(255,0,0)',
      pointBackgroundColor: 'rgba(255,0,0)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(255,0,0)',
      pointHoverBorderColor: 'rgba(255,0,0)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    },
    {
      label: 'Other Offenses',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'blue',
      borderColor: 'blue',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'blue',
      pointBackgroundColor: 'blue',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'blue',
      pointHoverBorderColor: 'blue',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    },
    {
      label: 'Weapons',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'black',
      borderColor: 'black',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'black',
      pointBackgroundColor: 'black',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'black',
      pointHoverBorderColor: 'black',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    },
    {
      label: 'Manslaughter',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'purple',
      borderColor: 'purple',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'purple',
      pointBackgroundColor: 'purple',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'purple',
      pointHoverBorderColor: 'purple',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    },
    {
      label: 'Aggravated Assault',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'grey',
      borderColor: 'grey',
      borderCapStyle: 'grey',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'grey',
      pointBackgroundColor: 'grey',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'grey',
      pointHoverBorderColor: 'grey',
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
          <Line data={aggData(selectedAgency)} />
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
          if (/^[0-9]{5}(?:-[0-9]{4})?$/.test(zipCode)) {
            fetch(url + 'search/' + zipCode)
              .then(resp => resp.json())
              .then(data => {
                setPosition(data);
              })
              .catch(e => {
                alert("Please enter a valid zip code")
                console.log(e);
              })
          }
          else {
            alert('please enter a valid US Zip Code');
          }
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


var mapZoom = 10;
const MapView = props => {
  const { position, setPosition } = props;
  useEffect(() => {
    const [latitude, longitude] = position;
    agencies = [];
    fetch(`${url}api/${latitude}/${longitude}/${props.year}`)
      .then(resp => resp.json())
      .then(data => {
        const [max, min] = data
          .filter(elem => {
            try {

              if (elem.results.length > 0) {
                return true;
              }
              else {
                return false;
              }
            }
            catch (e) {
              return false;
            }
          }).reduce((acc, curr) => {
            let temp = acc;
            const arrests = annualArrests(curr);
            if (arrests > acc[0])
              temp[0] = arrests;
            if (arrests < acc[1])
              temp[1] = arrests;
            return temp;
          }, [0, Number.MAX_SAFE_INTEGER]);
        const result = data
          .filter(elem => {
            try {

              if (elem.results.length > 0) {
                return true;
              }
              else {
                return false;
              }
            }
            catch (e) {
              return false;
            }
          })
          .map((elem, idx) => {
            agencies = [...agencies, elem];
            return (
              <Marker
                opacity="0"
                position={[elem.location.lat, elem.location.lng]}
              >
                {/*
                    <Popup>agency
                      {JSON.stringify(elem.location)}
                    </Popup>
                    */}
                <Circle
                  onclick={() => {
                    selectedAgency = idx;
                    props.setModalShow(true);
                  }}
                  center={[elem.location.lat, elem.location.lng]}
                  color="red"
                  fillColor="red"
                  fillOpacity="0.7"
                  radius={annualArrests(elem) * (2000 / max) + 100}
                />
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
    <Map
      center={position}
      zoom={mapZoom}
      onmoveend ={(e) => {
        mapZoom = e.target._zoom;
        const newPos = e.target.getCenter();
        setPosition([newPos.lat, newPos.lng]);
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
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
              <Dropdown.Item onClick={() => { setYear(2019) }}>2019</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2018) }}>2018</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2017) }}>2017</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2016) }}>2016</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2015) }}>2015</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2014) }}>2014</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2013) }}>2013</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2012) }}>2012</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2011) }}>2011</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2010) }}>2010</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2009) }}>2009</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2008) }}>2008</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2007) }}>2007</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2006) }}>2006</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2005) }}>2005</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2004) }}>2004</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2003) }}>2003</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2002) }}>2002</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2001) }}>2001</Dropdown.Item>
              <Dropdown.Item onClick={() => { setYear(2000) }}>2000</Dropdown.Item>
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
