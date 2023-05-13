import React, { useState, useEffect } from 'react';
import { getAuthUser } from "../../../helper/Storage";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CAlert,
} from '@coreui/react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner'
import('../../../scss/Default.css');

const Users = () => {
  const auth = getAuthUser();
  const [supervisor, setSupervisor] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
    submit: false
  });

  useEffect(() => {
    setSupervisor({ ...supervisor, loading: true });
    axios
      .get('http://localhost:3000/Supervisors/', {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        console.log(resp);
        setSupervisor({ ...supervisor, results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        setSupervisor({ ...supervisor, loading: false, err: 'something went wrong' });
      });
  }, []);

  const handleDelete = (UserID) => {
    axios.delete(`http://localhost:3000/Supervisors/${UserID}`, {
      headers: {
        token: auth[0].Token,
      },
    })
      .then((resp) => {
        //console.log(resp);
        setSupervisor({ ...supervisor, reload: supervisor.reload + 1 , submit:true });
      
        setTimeout(() => {
          window.location.reload();
      }, 3000);

      })
      .catch((errors) => {
        //console.log(errors)
        setSupervisor({
          ...supervisor,
          loading: false,
          err: errors.response.data.errors,

        });
      });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Supervisors</strong>
            <Link to="/Users/AddUser">
              <Button size="small" style={{ float: 'right' }}>
                ADD supervisor
              </Button>
            </Link>
          </CCardHeader>
          <CCardBody>
          {supervisor.submit === true && (
            <div className="text-center">
              <CAlert color="info">
                SUPERVISOR DELETED SUCCESSFULLY
              </CAlert>
            </div>
          )}
            {/* Loader */}
            {supervisor.loading === true && (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            {supervisor.err && supervisor.err.map((errors, index) => (
              <CAlert key={index} color="info" dismissible>
                {errors.msg}
              </CAlert>
            ))}
            {/* LIST supervisor */}
            {supervisor.loading === false && (
              <div className="row">


                <CTable striped hover className="my-table">
                  <CTableHead>
                    <CTableRow color="dark">
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Operations</CTableHeaderCell>

                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {supervisor.results.map((User) => (
                      <CTableRow key={User.ID} color="Light">

                        <CTableDataCell>{User.Email}</CTableDataCell>
                        <CTableDataCell>{User.Phone}</CTableDataCell>
                        <CTableDataCell>{User.Status}</CTableDataCell>

                        <CTableDataCell>
                          {/* {/PRODUCT ADDED SUCCESSFULLY/} */}

                          <div className="text-center">
                          <Link to={`/Users/UpdateUser?User_ID=${User.ID}&UserNAME=${User.Email}`}>
                        <CButton color="dark" size="small" style={{ textAlign: 'right', marginRight: '10px' }}>
                          Update
                        </CButton>
                      </Link>
                            <CButton color="dark" onClick={() => handleDelete(User.ID)} >
                              Delete
                            </CButton>
                          </div>

                        </CTableDataCell>

                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Users;