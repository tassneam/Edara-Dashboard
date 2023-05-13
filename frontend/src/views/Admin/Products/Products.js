import React, { useEffect, useState } from 'react'
import {
  CCard,
  CAlert,
  CCardHeader,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CButton,
  CFormInput
} from '@coreui/react'
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
import { getAuthUser } from "../../../helper/Storage";
const Products = () => {
  const [fromQuery, setFromQuery] = useState("");

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
      .catch((errors) => {
        //console.log(errors)
        setProducts({
          ...products,
          loading: false,
          err: errors.response.data.errors,

        });
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
      .get('http://localhost:3000/Products', {
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
  const [visible, setVisible] = useState(false)
  return (
    <>

      <CCard className="mb-4">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Products</strong>

          <div className="input-group"style={{ width: '300px', paddingRight: '10px' }}>
            <div className="input-group-append">
              <span className="input-group-text">
                <CIcon icon={icon.cilSearch} size="m" />
              </span>
            </div>
            <CFormInput
              type="text"
              placeholder="Search for Product"
              value={fromQuery}
              onChange={(e) => setFromQuery(e.target.value)}
              style={{ height: '30px', width: '80%', }}
            />
            
          </div>
          <Link to="/Products/AddProduct">
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
          {products.err && products.err.map((errors, index) => (
            <CAlert key={index} color="info" dismissible>
              {errors.msg}
            </CAlert>
          ))}
          {/* LIST PRODUCTS */}
          {products.loading === false && products.err === null && (
            <div className="row">
              {products.results.filter((product) => {
                const fromMatch = product.Name?.toLowerCase().includes(fromQuery.toLowerCase());
                return fromMatch;
              }).map((product) => (
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
                      <CButton onClick={() => Delete(product.ID) && setVisible(!visible)} color="dark" size="small">Delete</CButton>
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

export default Products
