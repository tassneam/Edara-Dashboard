import React, { useState } from "react";
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from "axios";
import { setAuthUser } from "../../helper/Storage";
import { useNavigate } from "react-router-dom";
const Login = () => {

  const navigate = useNavigate();
  const [login, setLogin] = useState({
    Email: "",
    Password: "",
    loading: false,
    err: [],
  });
  const [errors, setError] = useState(null);
  const LoginFun = (e) => {
    e.preventDefault();
    setLogin({ ...login, loading: true, err: [] });
    axios
      .post("http://localhost:3000/Auth/login ", {
        Email: login.Email,
        Password: login.Password,
      })
      .then((resp) => {
        setLogin({ ...login, loading: false, err: [] });
        //console.log(resp.data);
        setAuthUser(resp.data);
        if (resp.data[0].Type === "Admin") {
          navigate("/Products");
        } else if (resp.data[0].Type === "Supervisor") {
          navigate("/SuperProduct");
        }

      })
      .catch((errors) => {
        setLogin({
          ...login,
          loading: false,
          err: errors.response.data.errors,
        }); 
        setError(errors.response.data.errors[0].msg);
      });
  };


  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={LoginFun}>
                    <h1>Login</h1>  
                    {login.err.map((errors, index) => (
                      <CAlert key={index} color="info" onClose={() => setError(null)} dismissible>
                         {errors.msg}
                      </CAlert>
                    ))}
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput type="email"
                        placeholder="Email"
                        required
                        value={login.Email}
                        onChange={(e) => setLogin({ ...login, Email: e.target.value })} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        required
                        value={login.Password}
                        onChange={(e) => setLogin({ ...login, Password: e.target.value })}

                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit"
                          disabled={login.loading === true} >
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      You dont have an account? register Now!
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
