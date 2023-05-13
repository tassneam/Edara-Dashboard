import {
  CCard,
  CCardBody,
  CCardHeader,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormInput,
  CForm,
  CButton,
  CAlert,

} from '@coreui/react'

import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

import { getAuthUser } from "../../../helper/Storage";




const AddProductinwh = () => {
  const auth = getAuthUser();
  const [submit, setsubmit] = useState(false);
  const [Name, setName] = useState('');
  const [Location, setLocation] = useState('');
  const [Capacity, setCapacity] = useState('');
  const [supervisorID, setsupervisorID] = useState('');

  const [supervisor, setSupervisor] = useState({
    loading: true,
    err: [],
    results: [],
    reload: 0,
  });


  useEffect(() => {
    setSupervisor({ ...supervisor, loading: true })
    axios
      .get('http://localhost:3000/Supervisors', {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        //  console.log(resp)
        setSupervisor({ ...supervisor, results: resp.data, loading: false, err: null })
      })
      .catch((err) => {
        setSupervisor({
          ...supervisor,
          loading: false,
          err: err.response.data.errors.msg,
        });
      })
  }, [supervisor.reload]);
  // const [errors, setError] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const warehouseData = {
      Name: Name,
      Location: Location,
      Capacity: Capacity,
      Supervisor_ID: supervisorID,
    };
    axios
      .post("http://localhost:3000/warehouse ",
        {
          ...warehouseData,
        },
        {
          headers: {
            token: auth[0].Token,
          },
        })
      .then((resp) => {
        setsubmit(true);
        setName('');
        setLocation('');
        setCapacity('');
        setsupervisorID('');
        setSupervisor({ ...supervisor, reload: supervisor.reload + 1 });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((errors) => { 
        // console.log(errors)
        setSupervisor({
        ...supervisor,
        loading: false,
         err: errors.response.data.errors,
         
      }); 
     
    });

  }


  return (
    <>
      <CCard className="mb-4">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>ADD NEW WAREHOUSE</strong>
          <Link to="/Warehouses">
            <Button size="small" style={{ textAlign: 'right' }}>
              Show all Warehouses
            </Button>
          </Link>
        </CCardHeader>
        <CCardBody>

          {submit === true && (
            <div className="text-center">
              <CAlert color="info">
                WAREHOUSE ADDED SUCCESSFULLY
              </CAlert>
            </div>
          )}
          <CForm onSubmit={handleSubmit} className="w-100" >
            {supervisor.err && supervisor.err.map((errors, index) => (
              <CAlert key={index} color="info"  dismissible>
                {errors.msg}
              </CAlert>
            ))}

            <CInputGroup className="mb-3" size="lg">
              <CInputGroupText id="basic-addon1">Name</CInputGroupText>
              <CFormInput
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </CInputGroup>
            <CInputGroup size="lg" className="mb-3">
              <CInputGroupText id="inputGroup-sizing-lg">Location</CInputGroupText>
              <CFormInput
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                value={Location}
                onChange={(e) => setLocation(e.target.value)}
                required

              />
            </CInputGroup>
            <CInputGroup size="lg" className="mb-3">
              <CInputGroupText id="inputGroup-sizing-lg">Capacity</CInputGroupText>
              <CFormInput
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                value={Capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required

              />
            </CInputGroup>
            <CFormSelect
              id="floatingSelect"
              aria-label="Floating label select example"
              value={supervisorID}
              required
              onChange={(e) => setsupervisorID(e.target.value)}
              size="lg"
            >
              <option>Supervisor </option>
              {supervisor.results.map((supervisor => (
                <option key={supervisor.ID} value={supervisor.ID}>{supervisor.Email}</option>
              )))}

            </CFormSelect>
            <div style={{ textAlign: 'right' }}>
              <CButton color="dark" type="submit" style={{ marginTop: '10px' }} >
                Submit
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default AddProductinwh