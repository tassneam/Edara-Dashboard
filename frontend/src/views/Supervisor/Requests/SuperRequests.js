import React, { useState, useEffect } from 'react';
import { getAuthUser } from "../../../helper/Storage";
import { Link , } from 'react-router-dom';
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
  CAlert,
 
} from '@coreui/react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner'
import('../../../scss/Default.css');

const Requests = () => {
  const auth = getAuthUser();
  const [products, setproducts] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect(() => {
    setproducts({ ...products, loading: true });
    axios
      .get(`http://localhost:3000/showHistoryOfRequests/${auth[0].ID}`, {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        //console.log(resp);
        setproducts({ ...products, results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        setproducts({ ...products, loading: false, err: 'something went wrong' });
      });
  }, []);


  return (
    <>
    
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Requests</strong>
            <Link to="/AddRequests">
            <Button size="small" style={{ float: 'right' }}>
              Create Request
            </Button>
          </Link>
          </CCardHeader>
          <CCardBody>
            {/* Loader */}
            {products.loading === true && (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}


            {/* LIST products */}
            {products.loading === false && (
              <div className="row">
                <p className="text-medium-emphasis small">
                  THESE ARE ALL YOUR REQUESTS 
                </p>
                {products.err && products.err.map((errors, index) => (
              <CAlert key={index} color="info" dismissible>
                {errors.msg}
              </CAlert>
            ))}

                <CTable striped hover className="my-table">
                  <CTableHead>
                    <CTableRow color="dark">
                      
                      <CTableHeaderCell scope="col">Product_Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {products.results.map((request) => (
                      <CTableRow key={request.ID} color="Light">
                        <CTableDataCell>{request.product_name}</CTableDataCell>
                        <CTableDataCell>{request.Quantity}</CTableDataCell>
                        <CTableDataCell>{request.Status}</CTableDataCell>
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
    </>);
};

export default Requests;