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
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'
import React, { useEffect, useState, useRef } from 'react'
import {
  CCardImage,
  CCardText,
  CCardTitle,
} from '@coreui/react'
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { getAuthUser } from "../../../helper/Storage";
import('../../../scss/Default.css');
const AddProductinwh = () => {
  const [warehouse, setWarehouse] = useState({
    loading: true,
    err: [],
    results: [],
    reload: 0,
  });

  const [Warehouse_ID, setWarehouse_ID] = useState('');

  useEffect(() => {
    setWarehouse({ ...warehouse, loading: true })
    axios
      .get('http://localhost:3000/warehouse', {
        headers: {
          token: auth[0].Token,
        },
      })
      .then((resp) => {
        //  console.log(resp)
        setWarehouse({ ...warehouse, results: resp.data, loading: false, err: null })
      })
      .catch((err) => {
        setWarehouse({
          ...warehouse,
          loading: false,
          err: err.response.data.errors.msg,
        });
      })
  }, [warehouse.reload]);
  // const [errors, setError] = useState(null);


  const auth = getAuthUser();
  const [submit, setsubmit] = useState(false);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [Stock, setStock] = useState('');

  const handleSubmit = (event) => {

    event.preventDefault();
    // perform form submission logic here
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('Photo', photo);
    formData.append('Stock', Stock);

    axios
      .post(`http://localhost:3000/Products/${Warehouse_ID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Token: auth[0].Token },
      })
      .then((resp) => {
        //console.log(resp);
        setsubmit(true);
        setName('');
        setPhoto(null);
        setDescription('');
        setWarehouse_ID('');
        setStock('');
        document.getElementById('inputGroupFile01').value = '';
        setTimeout(() => {
          window.location.reload();
        }, 3000);

      })
      .catch((err) => {
        setWarehouse({
          ...warehouse,
          loading: false,
          err: err.response.data.errors,
        });
      });

  }


  return (
    <>
      <CCard className="mb-4">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>ADD NEW PRODUCT</strong>
          <Link to="/Products">
            <Button size="small" style={{ textAlign: 'right' }}>
              Show all Product
            </Button>
          </Link>
        </CCardHeader>
        <CCardBody>
          {/*PRODUCT ADDED SUCCESSFULLY */}
          {submit === true && (
            <div className="text-center">
              <CAlert color="info">
                PRODUCT ADDED SUCCESSFULLY
              </CAlert>
            </div>
          )}
          <CForm onSubmit={handleSubmit} className="w-100" >
            {warehouse.err && warehouse.err.map((errors, index) => (
              <CAlert key={index} color="info" dismissible>
                {errors.msg}
              </CAlert>
            ))}
            <CInputGroup className="mb-3" size="lg">
              <CInputGroupText id="basic-addon1">Name</CInputGroupText>
              <CFormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </CInputGroup>
            <CInputGroup className="mb-3" size="lg" >
              <CInputGroupText component="label" htmlFor="inputGroupFile01">
                Photo
              </CInputGroupText>
              <CFormInput
                type="file"
                id="inputGroupFile01"
                onChange={(e) => setPhoto(e.target.files[0])}

              />
            </CInputGroup>
            <CInputGroup size="lg" className="mb-3">
              <CInputGroupText id="inputGroup-sizing-lg">Description</CInputGroupText>
              <CFormInput
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </CInputGroup>
            <CInputGroup size="lg" className="mb-3">
              <CInputGroupText id="inputGroup-sizing-lg">Stock</CInputGroupText>
              <CFormInput
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                value={Stock}
                required
                onChange={(e) => setStock(e.target.value)}
              />
            </CInputGroup>
            <CFormSelect size="lg"
              id="floatingSelect"
              aria-label="Floating label select example"
              value={Warehouse_ID}
              required
              onChange={(e) => setWarehouse_ID(e.target.value)}
            >
              <option>WAREHOUSE </option>
              {warehouse.results.map((warehouse => (
                <option key={warehouse.ID} value={warehouse.ID}>{warehouse.Name}</option>
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