import React, { useState, useEffect } from 'react';
import { getAuthUser } from "../../../helper/Storage";
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
  CAlert
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
      .get('http://localhost:3000/RequestsHistory/', {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        console.log(resp);
        setproducts({ ...products, results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        setproducts({ ...products, loading: false, err: 'something went wrong' });
      });
  }, []);

  const handleStatusChange = (requestID, newStatus) => {
    axios.put(`http://localhost:3000/StockRequests/${requestID}`, {
      Action: newStatus
    },{
      headers: {
        token: auth[0].Token,
      },
    })

      .then((resp) => {
       // console.log(resp);
        setproducts({ ...products, reload: products.reload + 1 });

        window.location.reload();

      })
      .catch((errors) => {
        //console.log(errors)
        setproducts({
          ...products,
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
            <strong>Requests</strong>
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
                  These are all the requests made by all supervisors{' '}
                </p>
                {products.err && products.err.map((errors, index) => (
              <CAlert key={index} color="info" dismissible>
                {errors.msg}
              </CAlert>
            ))}

                <CTable striped hover className="my-table">
                  <CTableHead>
                    <CTableRow color="dark">
                      <CTableHeaderCell scope="col">product_name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">warehouse_name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Supervisor_email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Operations</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {products.results.map((request) => (
                      <CTableRow key={request.ID} color="Light">
                        <CTableDataCell>{request.product_name}</CTableDataCell>
                        <CTableDataCell>{request.warehouse_name }</CTableDataCell>
                        <CTableDataCell>{request.email}</CTableDataCell>
                        <CTableDataCell>{request.Quantity}</CTableDataCell>
                        <CTableDataCell>{request.Status}</CTableDataCell>
                        <CTableDataCell>
                          {/* {/PRODUCT ADDED SUCCESSFULLY/} */}
                          {request.Status === 'Pending' && (
                            <div className="text-center">
                              <CButton color="dark"  onClick={() => handleStatusChange(request.ID, 'Approved')} style={{ marginRight: '10px' }}>
                                Accept
                              </CButton>
                              <CButton color="dark" onClick={() => handleStatusChange(request.ID, 'Rejected')}>
                                decline
                              </CButton>
                            </div>
                          )}
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

export default Requests;