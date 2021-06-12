import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow
} from '@coreui/react'
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import { useDispatch } from 'react-redux'
import env from "react-dotenv";
const url = env.API_URL


const Login = (props) => {
  const [validated, setValidated] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch()

  const notifyS = (msg) => toast.success(msg);
  const notifyF = (msg) => toast.error(msg);

  const cookies = new Cookies();
  const authCookie = cookies.get('authCookie');
  if (authCookie) {
    history.push('/dashboard/admin');
  }
  const inputStyle = { color: '#000' };
  const handleLogin = (event) => {
    const form = event.currentTarget;
    event.preventDefault()
    const templateParams = {
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
    };
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      axios.post(`${url}auth/login`, templateParams,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
        .then(response => {
          notifyS(response.data.msg);
          cookies.set('authCookie', response.data.token, { secure: true, sameSite: true });
          cookies.set('image_url', response.data.image_url);
          props.isAuthenticated(true);
          dispatch({ type: 'user', user: response.data.image_url })

          setTimeout(() => {
            history.push("/dashboard/admin");
          }, 1000);
        }).catch(err => {
          notifyF(err.response.data.errors);
        })
    }
  };
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <div className="text-center mb-4">
                    {/* <img src="/images/logo.svg" alt="" /> */}
                  </div>
                  <Form noValidate validated={validated} onSubmit={handleLogin}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control style={inputStyle} type="email" name="email" required placeholder="Email" />
                      <Form.Control.Feedback type="invalid">
                        Invalid Email
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control style={inputStyle} type="password" required name="password" placeholder="Password" />
                      <Form.Control.Feedback type="invalid">
                        Invalid Password
                      </Form.Control.Feedback>
                    </Form.Group>
                    <CButton color="success" type="submit">
                      Submit
                    </CButton>
                  </Form>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer
        autoClose={3000}
      />
    </div>
  )
}

export default Login
