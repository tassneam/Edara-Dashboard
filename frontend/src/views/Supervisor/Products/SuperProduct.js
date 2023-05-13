import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import {
  CCard,
  CAlert,
  CCardHeader,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CButton,
  CChartBar, CWidgetStatsE, CCol, CRow
} from '@coreui/react'
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
import { getAuthUser } from "../../../helper/Storage";

const Productsinwh = () => {

  const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const warehouse_ID = searchParams.get('warehouse_ID');
  // const warehouseName = searchParams.get('warehouseNAME');


  const auth = getAuthUser();

  const [Warehouse, setWarehouse] = useState({
    loading: true,
    Warehouse: [],
    err: null,
    reload: 0,
  })
  useEffect(() => {
    setWarehouse({ ...Warehouse, loading: true })
    axios
      .get(`http://localhost:3000/showProducts/GETWHINFO/${auth[0].ID}`, {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        //console.log(resp)
        setWarehouse({ ...Warehouse, Warehouse: resp.data, loading: false, err: null })
      })
      .catch((err) => {
        setWarehouse({ ...Warehouse, loading: false, err: 'something went wrong' })
      })
  }, [])


  const [products, setProducts] = useState({
    loading: true,
    products: [],
    err: null,
    reload: 0,
  })
  useEffect(() => {
    setProducts({ ...products, loading: true })
    axios
      .get(`http://localhost:3000/showProducts/${auth[0].ID}`, {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        //console.log(resp)
        setProducts({ ...products, products: resp.data, loading: false, err: null })
      })
      .catch((err) => {
        setProducts({ ...products, loading: false, err: 'something went wrong' })
      })
  }, [])
  // products.reload

  return (
    <>
      <CCard className="mb-4">
        {Warehouse.loading === true && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {products.loading === false && products.err === null && (
          <div><CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Warehouse :  {Warehouse.Warehouse[0].Name} Details</strong>
          </CCardHeader><CRow>
              <CCol xs={4} style={{ marginBottom: '10px', marginTop: '20px' }}>
                <CWidgetStatsE
                  className="mb-3"

                  title="Capacity"
                  value={Warehouse.Warehouse[0].Capacity}
                />
              </CCol>
              <CCol xs={4} style={{ marginBottom: '10px', marginTop: '20px' }} >
                <CWidgetStatsE
                  className="mb-3"

                  title="Location"
                  value={Warehouse.Warehouse[0].Location}
                />
              </CCol>
              <CCol xs={4} style={{ marginBottom: '10px', marginTop: '20px' }} >
                <CWidgetStatsE
                  className="mb-3"

                  title="Status"
                  value={Warehouse.Warehouse[0].Status}
                />
              </CCol></CRow>
          </div>
        )}

        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Products supervised by {auth[0].Email}</strong>
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
          {/* LIST PRODUCTS */}
          {products.loading === false && products.err === null && (
            <div className="row">
              {products.products.map((product) => (
                <div
                  key={null}
                  className="col-3 card-product-container"
                  style={{ marginBottom: '20px', marginTop: '20px' }}
                >
                  <CCard style={{ width: '18rem' }}>
                    <CCardImage orientation="top"
                      src={product.Photo}
                      style={{ height: '10rem', objectFit: 'cover' }} />
                    <CCardBody style={{ height: '15rem' }}>
                      <CCardTitle>{product.Name}</CCardTitle>
                      <CCardText>{product.Description}</CCardText>
                      {/* red alert when stock is low  */}
                      <CCardText style={{
                        color: product.Stock >= 50 ? 'green' :
                          product.Stock >= 20 ? '#FFC107' :
                            'red'
                      }}>
                        Stock: {product.Stock}
                      </CCardText>

                    </CCardBody>
                  </CCard>
                </div>
              ))}
            </div>
          )}

          {products.loading === false && products.err != null && (
            <div className="text-center">
              <CAlert variant="danger" className="p-2">
                Error 404
              </CAlert>
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Productsinwh
