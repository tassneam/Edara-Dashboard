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
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { getAuthUser } from "../../../helper/Storage";


const UpdateWarehouse = () => {


    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const warehouseNAME = searchParams.get('warehouseNAME');
    const warehouse_ID = searchParams.get('warehouse_ID');
    const auth = getAuthUser();

    const [submit, setsubmit] = useState(false);
    const [name, setName] = useState('');
    const [Location, setLocation] = useState('');
    const [Capacity, setCapacity] = useState('');
    const [supervisorID, setsupervisorID] = useState('');
    const [status, setstatus] = useState('');

    const [warehouse, setWarehouse] = useState({
        loading: true,
        err: [],
        results: [],
        reload: 0,
    });


    useEffect(() => {
        setWarehouse({ ...warehouse, loading: true })
        axios
            .get('http://localhost:3000/Supervisors', {
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


    const handleSubmit = (event) => {


        event.preventDefault();
        // perform form submission logic here
        const warehouseData = {
            Name: name,
            Location: Location,
            Capacity: Capacity,
            Supervisor_ID: supervisorID,
            Status :status
        };

        axios
            .put(`http://localhost:3000/warehouse/${warehouse_ID}`, {
                ...warehouseData,
            },
                {
                    headers: {
                        token: auth[0].Token,
                    },
                })
            .then((resp) => {
                //console.log(resp);
                setsubmit(true);
                setName('');
                setCapacity('');
                setLocation('');
                setsupervisorID('');
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
            })

    }
    return (
        <>
            <CCard className="mb-4">
                <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Update WAREHOUSE {warehouseNAME} </strong> (You can choose whatever you want to update)
                    <Link to="/Warehouses">
                        <Button size="small" style={{ textAlign: 'right' }}>
                            Show all Warehouses
                        </Button>
                    </Link>
                </CCardHeader>
                <CCardBody>
                    {/*PRODUCT ADDED SUCCESSFULLY */}
                    {submit === true && (
                        <div className="text-center">
                            <CAlert color="info">
                                WAREHOUSE UPDATED SUCCESSFULLY
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
                            <CInputGroupText id="basic-addon1"> NEW Name</CInputGroupText>
                            <CFormInput
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </CInputGroup>
                        <CInputGroup size="lg" className="mb-3">
                            <CInputGroupText id="inputGroup-sizing-lg">NEW Location</CInputGroupText>
                            <CFormInput
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-lg"
                                value={Location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </CInputGroup>
                        <CInputGroup size="lg" className="mb-3">
                            <CInputGroupText >NEW Capacity</CInputGroupText>
                            <CFormInput
                                value={Capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                            />
                        </CInputGroup>
                        <CFormSelect
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            value={supervisorID}
                            onChange={(e) => setsupervisorID(e.target.value)}
                            className="mb-3"
                            size="lg"
                        >
                            <option>NEW Supervisor </option>
                            {warehouse.results.map((warehouse => (
                                <option key={warehouse.ID} value={warehouse.ID}>{warehouse.Email}</option>
                            )))}
                        </CFormSelect>
                        <CFormSelect
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            onChange={(e) => setstatus(e.target.value)}
                            size="lg"
                        >
                            <option>Status </option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </CFormSelect>
                        <div style={{ textAlign: 'right' }}>
                            <CButton color="dark" type="submit" style={{ marginTop: '10px' }} size="lg" >
                                Submit
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        </>
    )
}

export default UpdateWarehouse