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
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { getAuthUser } from "../../../helper/Storage";


const AddProductinwh = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const Product_ID = searchParams.get('Product_ID');
  const oldwarehouse_ID = searchParams.get('warehouse_ID');


  const auth = getAuthUser();
  const [warehouse_ID, setwarehouse_ID] = useState('');

  const [submit, setsubmit] = useState(false);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [warehouses, setWarehouses] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  })



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





  const handleSubmit = (event) => {


    event.preventDefault();
    // perform form submission logic here
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('Photo', photo);
    formData.append('NewwarehouseID', warehouse_ID);

    axios
      .put(`http://localhost:3000/Products/${oldwarehouse_ID}/${Product_ID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', token: auth[0].Token },
      })
      .then((resp) => {
        //console.log(resp);
        setsubmit(true);
        setName('');
        setPhoto(null);
        setDescription('');
        document.getElementById('inputGroupFile01').value = '';
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((err) => {
        setWarehouses({
          ...warehouses,
          loading: false,
          err: err.response.data.errors,
        });
      })

  }


  return (
    <>
      <CCard className="mb-4">
        <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Update Product </strong> (You can choose whatever you want to update)
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
                PRODUCT UPDATED SUCCESSFULLY
              </CAlert>
            </div>
          )}
          <CForm onSubmit={handleSubmit} className="w-100" >
            {warehouses.err && warehouses.err.map((errors, index) => (
              <CAlert key={index} color="info" dismissible>
                {errors.msg}
              </CAlert>
            ))}
            <CInputGroup className="mb-3">
              <CInputGroupText id="basic-addon1"> NEW Name</CInputGroupText>
              <CFormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText component="label" htmlFor="inputGroupFile01">
                NEW Photo
              </CInputGroupText>
              <CFormInput
                type="file"
                id="inputGroupFile01"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </CInputGroup>
            <CInputGroup size="lg" className="mb-3">
              <CInputGroupText id="inputGroup-sizing-lg">NEW Description</CInputGroupText>
              <CFormInput
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CInputGroup>
            <CFormSelect
              id="floatingSelect"
              aria-label="Floating label select example"
              value={warehouse_ID}
              onChange={(e) => setwarehouse_ID(e.target.value)}
            >
              <option>NEW WAREHOUSES </option>
              {warehouses.results.map((warehouse => (
                <option key={warehouse.ID} value={warehouse.ID}>{warehouse.Name}</option>
              )))}

            </CFormSelect>
            <div style={{ textAlign: 'right' }}>
              <CButton color="dark" type="submit" style={{ marginTop: '10px' }}>
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