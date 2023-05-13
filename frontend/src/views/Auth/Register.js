import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from "axios";
import { setAuthUser } from "../../helper/Storage";
import { useNavigate } from "react-router-dom";
const Register = () => {

  const navigate = useNavigate();
  const [register, setRegister] = useState({
    Email: "",
    Password: "",
    confirmPassword: "",
    Phone: "",
    loading: false,
    err: [],
  });
  const [errors, setError] = useState(null);

  const RegisterFun = (e) => {
    e.preventDefault();
    
    if (register.Password !== register.confirmPassword) {
      setRegister({
        ...register,
        err: [{ msg: "Passwords do not match" }]
      });
      return;
    }
    setRegister({ ...register, loading: true, err: [] });
    axios
      .post("http://localhost:3000/Auth/register", {
        Email: register.Email,
        Password: register.Password,
        Phone: register.Phone,
      })
      
      .then((resp) => {
        setRegister({ ...register, loading: false, err: [] });
        setAuthUser(resp.data);
        navigate("/Login");
      })
      .catch((errors) => {
        setRegister({
          ...register,
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
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={RegisterFun} >
                  <h1>Register</h1>
                  {register.err.map((errors, index) => (
                      <CAlert key={index} color="info" onClose={() => setError(null)} dismissible>
                         {errors.msg}
                      </CAlert>
                    ))}
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput type="email"
                      placeholder="Email"
                      value={register.Email}
                      onChange={(e) =>
                        setRegister({ ...register, Email: e.target.value })}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>+02</CInputGroupText>
                    <CFormInput placeholder="Phone Number" type="tel"
                      value={register.Phone}
                      onChange={(e) => setRegister({ ...register, Phone: e.target.value })} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      value={register.Password}
                      onChange={(e) =>
                        setRegister({ ...register, Password: e.target.value })
                      }
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      value={register.confirmPassword}
                      onChange={(e) =>
                        setRegister({ ...register, confirmPassword: e.target.value })
                      }
                   
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" className="btn btn-dark w-100"
                      type="submit"
                      >Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
