import { DocsLink } from 'src/components'
import React, { useEffect, useState } from 'react'
import {
  CCard,
  CAlert,
  CCardHeader,
  CCardBody,
  CCardText,
  CListGroup,
  CListGroupItem,
  CCardTitle,
  CButton
} from '@coreui/react'
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
import { getAuthUser } from "../../../helper/Storage";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  })

  const auth = getAuthUser();
  const Delete = (requestID) => {
    axios.delete(`http://localhost:3000/warehouse/${requestID}`, {
      headers: {
        token: auth[0].Token,
      },
    })
      .then((resp) => {
        //console.log(resp);
        window.location.reload();
      })
      .catch((err) => {
        setWarehouses({
          ...warehouses,
          loading: false,
          err: err.response.data.errors,
        });
      })
  };


  useEffect(() => {
    setWarehouses({ ...warehouses, loading: true })
    axios
      .get('http://localhost:3000/warehouse/', {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        // console.log(resp)
        setWarehouses({ ...warehouses, results: resp.data, loading: false, err: null })
      })
      .catch((err) => {
        setWarehouses({ ...warehouses, loading: false, err: 'something went wrong' })
      })
  }, [])
  // warehouses.reload

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Warehouse</strong>
          <Link to="/Warehouses/AddWarehouse">
            <Button size="small" style={{ textAlign: 'right' }}>
              ADD Warehouse
            </Button>
          </Link>
        </CCardHeader>
        <CCardBody>
          {/* Loader */}
          {warehouses.loading === true && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          {/* LIST WAREHOUSES */}
          {warehouses.loading === false && warehouses.err === null && (
            <div className="row" >
              {warehouses.results.map((warehouse) => (
                <div
                  key={null}
                  className="col-4 card-warehouse-container"
                  style={{ marginBottom: '20px', marginTop: '20px' }}
                >
                  <CCard style={{ width: '25rem' }}>
                    <CCardBody>
                      <CCardTitle>{warehouse.Name}</CCardTitle>
                      <CCardText >{warehouse.Status}</CCardText>
                      <CListGroup flush>
                        <CListGroupItem>Location : {warehouse.Location} </CListGroupItem>
                        <CListGroupItem>Capacity : {warehouse.Capacity}</CListGroupItem>
                        <CListGroupItem>Supervised by : {warehouse.SupervisorName}</CListGroupItem>
                        <CListGroupItem></CListGroupItem>
                      </CListGroup>
                      <Link to={`/Warehouses/Productsinwh?warehouse_ID=${warehouse.ID}&warehouseNAME=${warehouse.Name}`}>
                        <CButton color="dark" size="small" style={{ textAlign: 'right', marginRight: '10px' }}>
                          View Products
                        </CButton>
                      </Link>
                      <Link to={`/Warehouses/UpdateWarehouse?warehouse_ID=${warehouse.ID}&warehouseNAME=${warehouse.Name}`}>
                        <CButton color="dark" size="small" style={{ textAlign: 'right', marginRight: '10px' }}>
                          Update
                        </CButton>
                      </Link>
                      <CButton onClick={() => Delete(warehouse.ID)} color="dark" size="small">Delete</CButton>
                    </CCardBody>
                  </CCard>
                </div>
              ))}
            </div>
          )}

          {warehouses.loading === false && warehouses.err != null && (
            <div className="text-center">
              {warehouses.err && warehouses.err.map((errors, index) => (
                <CAlert key={index} color="info" dismissible>
                  {errors.msg}
                </CAlert>
              ))}
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Warehouses
