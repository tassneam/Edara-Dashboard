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
import { useLocation } from 'react-router-dom';

import { getAuthUser } from "../../../helper/Storage";
const AddProductinwh = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const warehouseName = searchParams.get('warehouseNAME');
  const warehouse_ID = searchParams.get('warehouse_ID');

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
      .post(`http://localhost:3000/Products/${warehouse_ID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Token: auth[0].Token },
      })
      .then((resp) => {
        console.log(resp);
        setsubmit(true);
        setName('');
        setPhoto(null);
        setDescription('');
        setStock('');
        document.getElementById('inputGroupFile01').value = '';
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
      });

  }


  return (
    <>
      <CCard className="mb-4">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Add new product in {warehouseName}</strong>
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
            <CInputGroup className="mb-3" size="lg">
              <CInputGroupText id="basic-addon1">Name</CInputGroupText>
              <CFormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </CInputGroup>
            <CInputGroup className="mb-3"size="lg">
              <CInputGroupText component="label" htmlFor="inputGroupFile01">
                Photo
              </CInputGroupText>
              <CFormInput
                type="file"
                id="inputGroupFile01"
                onChange={(e) => setPhoto(e.target.files[0])}
                required
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
            <div style={{ textAlign: 'right' }}>
              <CButton size="lg" color="dark" type="submit" style={{ marginTop: '10px' }} >
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