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




const AddUser = () => {
  const auth = getAuthUser();
  const [submit, setsubmit] = useState(false);
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Phone, setPhone] = useState('');
  const [supervisor, setSupervisor] = useState({
    loading: true,
    err: [],
    reload: 0,
  });



  // const [errors, setError] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      Email: Email,
      Password: Password,
      Phone: Phone,

    };
    axios
      .post("http://localhost:3000/Supervisors/",
        {
          ...userData,
        },
        {
          headers: {
            token: auth[0].Token,
          },
        })
      .then((resp) => {
        setsubmit(true);
        setEmail('');
        setPassword('');
        setPhone('');
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
          <strong>ADD NEW SUPERVISOR</strong>
          <Link to="/Users">
            <Button size="small" style={{ float: 'right' }}>
              Show all supervisors
            </Button>
          </Link>
        </CCardHeader>
        <CCardBody>

          {submit === true && (
            <div className="text-center">
              <CAlert color="info">
                SUPERVISOR ADDED SUCCESSFULLY
              </CAlert>
            </div>
          )}
          <CForm onSubmit={handleSubmit} className="w-100" >
            {supervisor.err && supervisor.err.map((errors, index) => (
              <CAlert key={index} color="info" dismissible>
                {errors.msg}
              </CAlert>
            ))}

            <CInputGroup className="mb-3" size="lg">
              <CInputGroupText id="basic-addon1">Email</CInputGroupText>
              <CFormInput
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </CInputGroup>
            <CInputGroup size="lg" className="mb-3">
              <CInputGroupText id="inputGroup-sizing-lg">Password</CInputGroupText>
              <CFormInput
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required

              />
            </CInputGroup>
            <CInputGroup size="lg" className="mb-3">
              <CInputGroupText id="inputGroup-sizing-lg">Phone</CInputGroupText>
              <CFormInput
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                value={Phone}
                onChange={(e) => setPhone(e.target.value)}
                required

              />
            </CInputGroup>

            <div style={{ textAlign: 'right' }}>
              <CButton color="dark" type="submit" >
                Submit
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default AddUser
