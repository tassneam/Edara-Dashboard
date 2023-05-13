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


const UpdateUser = () => {


    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const UserNAME = searchParams.get('UserNAME');
    const User_ID = searchParams.get('User_ID');
    const auth = getAuthUser();

    const [submit, setsubmit] = useState(false);
    const [Email, setEmail] = useState('');
    const [Phone, setPhone] = useState('');
    const [status, setstatus] = useState('');
    const [Password, setPassword] = useState('');

    const [User, setUser] = useState({
        loading: true,
        err: [],
        results: [],
        reload: 0,
    });



    const handleSubmit = (event) => {


        event.preventDefault();
        // perform form submission logic here
        const UserData = {
            Email: Email,
            Phone: Phone,
            Status :status,
            Password :Password
        };

        axios
            .put(`http://localhost:3000/Supervisors/${User_ID}`, {
                ...UserData,
            },
                {
                    headers: {
                        token: auth[0].Token,
                    },
                })
            .then((resp) => {
                //console.log(resp);
                setsubmit(true);
                setEmail('');
                setPhone('');
                setstatus('');
                setPassword('');
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
            .catch((err) => {
                setUser({
                    ...User,
                    loading: false,
                    err: err.response.data.errors,
                });
            })

    }
    return (
        <>
            <CCard className="mb-4">
                <CCardHeader  style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong >Update User {UserNAME} </strong> (You can choose whatever you want to update)
                    <Link to="/Users">
                        <Button  size="lg" style={{ textAlign: 'right' }}>
                            Show all Users
                        </Button>
                    </Link>
                </CCardHeader>
                <CCardBody >
                    {/*PRODUCT ADDED SUCCESSFULLY */}
                    {submit === true && (
                        <div className="text-center">
                            <CAlert color="info">
                                USER UPDATED SUCCESSFULLY
                            </CAlert>
                        </div>
                    )}
                    <CForm onSubmit={handleSubmit} className="w-100" >
                        {User.err && User.err.map((errors, index) => (
                            <CAlert key={index} color="info" dismissible>
                                {errors.msg}
                            </CAlert>
                        ))}
                        <CInputGroup size="lg" className="mb-3">
                            <CInputGroupText id="basic-addon1" > NEW EMAIL</CInputGroupText>
                            <CFormInput
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </CInputGroup>
                        <CInputGroup size="lg" className="mb-3">
                            <CInputGroupText id="inputGroup-sizing-lg">NEW PHONE</CInputGroupText>
                            <CFormInput
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-lg"
                                value={Phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </CInputGroup>
                        <CInputGroup size="lg" className="mb-3">
                            <CInputGroupText id="inputGroup-sizing-lg">NEW PASSWORD</CInputGroupText>
                            <CFormInput
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-lg"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </CInputGroup>
                        <CFormSelect
                        size="lg"
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            onChange={(e) => setstatus(e.target.value)}  
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

export default UpdateUser