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
  const [Product_ID, setProduct_ID] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [Request, setRequest] = useState({
    loading: true,
    err: [],
    reload: 0,
  });



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
        setProducts({ ...products, loading: false, err: err })
      })
  }, [])



  // const [errors, setError] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    let Data = {
      ProductID: Product_ID,
      quantity: Quantity,

    };
    axios
      .post(`http://localhost:3000/CreateRequest/${auth[0].ID}`,
        {
          ...Data,
        },
        {
          headers: {
            token: auth[0].Token,
          },
        })
      .then((resp) => {
        setsubmit(true);
        setProduct_ID('');
        setQuantity('');
        setRequest({ ...Request, reload: Request.reload + 1 });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((errors) => {
        // console.log(errors)
        setRequest({
          ...Request,
          loading: false,
          err: errors.response.data.errors,

        });

      });
  }
  const [visible, setVisible] = useState(false)

  return (
    <>
    
      <CCard className="mb-4">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Create new Request</strong>
          <Link to="/SuperRequests">
            <Button size="small" style={{ float: 'right' }}>
              Show all Requests
            </Button>
          </Link>
        </CCardHeader>
        <CCardBody>

          {submit === true && (
            <div className="text-center">
              <CAlert color="info">
                REQUEST SUBMITTED SUCCESSFULLY
              </CAlert>
            </div>
          )}
          <CForm onSubmit={handleSubmit} className="w-100" >
            {Request.err && Request.err.map((errors, index) => (
              <CAlert key={index} color="info" dismissible>
                {errors.msg}
              </CAlert>
            ))}

            <CFormSelect
              required
              className="mb-3"
              size="lg"
              id="floatingSelect"
              aria-label="Floating label select example"

              onChange={(e) => setProduct_ID(e.target.value)}
            >
              <option>Product </option>
              {products.products.map((products => (
                <option key={products.ID} value={products.ID}>{products.Name}</option>
              )))}

            </CFormSelect>
            <CInputGroup size="lg" className="mb-3">
              <CInputGroupText id="inputGroup-sizing-lg">Quantity</CInputGroupText>
              <CFormInput
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                value={Quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required

              />
            </CInputGroup>

            <div style={{ textAlign: 'right' }}>
              <CButton color="dark" type="submit"  >
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
