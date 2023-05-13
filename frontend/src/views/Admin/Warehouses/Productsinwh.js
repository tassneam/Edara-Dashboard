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
  CButton
} from '@coreui/react'
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
import { getAuthUser } from "../../../helper/Storage";
const Productsinwh = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const warehouse_ID = searchParams.get('warehouse_ID');
  const warehouseName = searchParams.get('warehouseNAME');


  const auth = getAuthUser();


  const Delete = (requestID) => {
    axios.delete(`http://localhost:3000/Products/${requestID}`, {
      headers: {
        token: auth[0].Token,
      },
    })
      .then((resp) => {
        //console.log(resp);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [products, setProducts] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  })
  useEffect(() => {
    setProducts({ ...products, loading: true })
    axios
      .get(`http://localhost:3000/Products/${warehouse_ID}`, {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        //console.log(resp)
        setProducts({ ...products, results: resp.data, loading: false, err: null })
      })
      .catch((err) => {
        setProducts({ ...products, loading: false, err: 'something went wrong' })
      })
  }, [])
  // products.reload
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Products in {warehouseName}</strong>
          <Link to={`/Warehouses/AddProductinwh?warehouseNAME=${warehouseName}&warehouse_ID=${warehouse_ID}`}>
            <Button size="small" style={{ textAlign: 'right' }}>
              ADD Product
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
          {/* LIST PRODUCTS */}
          {products.loading === false && products.err === null && (
            <div className="row">
              {products.results.map((product) => (
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
                      <Link to={`/Warehouses/UpdateProduct?Product_ID=${product.ID}&warehouse_ID=${warehouse_ID}`}>
                        <CButton color="dark" size="small" style={{ textAlign: 'right', marginRight: '10px' }}>
                          Update
                        </CButton>
                      </Link>
                      <CButton onClick={() => Delete(product.ID)} color="dark" size="small">Delete</CButton>
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
