import React, { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { Spinner, Form } from 'react-bootstrap';
import axios from '../../assets/api';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'

const User = (props) => {
  const [spin, setSpin] = useState(false);
  const [spinD, setSpinD] = useState(false);
  const history = useHistory()
  if (props.location.state) {
    const notifyS = (msg) => toast.success(msg);

    if (!props.location.state.data) {
      history.push("/dashboard/admin/users");
    }
    const notifyF = (msg) => toast.error(msg);
    const users = props.location.state.data;
    const user = users.filter((user) => user.id.toString() === props.match.params.id.toString())
    const data = { ...user[0] };
    const del = (id) => {
      setSpin(true);
      axios.delete(`admin/users/${id}`).then(res => {
        setSpin(false);
        notifyS('deleted user successfuly');
        history.push("/dashboard/admin/users");
      }).catch(err => {
        setSpin(false);
        notifyF('you cant delete this user');
      })
    }
    const submit = (e) => {
      e.preventDefault();
      setSpinD(true);
      let newData = new FormData(e.currentTarget);
      axios.post(`admin/users/${props.match.params.id}`, newData).then(res => {
        setSpinD(false);
        notifyS('user edited successfully');
        history.push('/dashboard/admin/users')
      })
    }
    return (
      <CRow>
        <CCol lg={12}>
          <CCard>
            <CCardHeader>
              <CButton color={'danger'} onClick={() => del(props.match.params.id)}>
                {spin ? <Spinner animation="border" variant="light" /> : ''}
              Delete User
            </CButton>
            </CCardHeader>
            <CCardBody>
              <Form onSubmit={(e) => submit(e)}>
                <CRow>
                  <Form.Group as={CCol} md="6" controlId="validationCustom01">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      defaultValue={data.first_name}
                      name='first_name'
                    />
                  </Form.Group>
                  <Form.Group as={CCol} md="6" controlId="validationCustom02">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      defaultValue={data.last_name}
                      type="text"
                      required
                      name='last_name'
                    />
                  </Form.Group>
                  <Form.Group as={CCol} md="6" controlId="validationCustom03">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      defaultValue={data.name}
                      required
                      type="text"
                      name='name'
                    />
                  </Form.Group>
                  <Form.Group as={CCol} md="6" controlId="validationCustom04">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      defaultValue={data.phone}
                      required
                      type="text"
                      name='phone'
                    />
                  </Form.Group>
                  <Form.Group as={CCol} md="6" controlId="validationCustom05">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      defaultValue={data.email}
                      required
                      type="email"
                      name='email'
                    />
                  </Form.Group>
                  <Form.Group as={CCol} md="6" controlId="validationCustom06">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name='password'
                    />
                  </Form.Group>
                  <Form.Group as={CCol} md="6" controlId="validationCustom07">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name='password_confirmation'
                    />
                  </Form.Group>
                  <Form.Group as={CCol} md="6" controlId="validationCustom08">
                    <Form.Label>User image</Form.Label>
                    <Form.Control
                      type="file"
                      name='image'
                    />
                  </Form.Group>
                  <Form.Group as={CCol} md="6" controlId="validationCustom09">
                    <CButton color={'success'} type='submit'>
                      {spinD ? <Spinner animation="border" variant="light" /> : ''}
                    Save
                  </CButton>
                  </Form.Group>
                </CRow>
              </Form>
            </CCardBody>
          </CCard>
          <ToastContainer
            autoClose={3000}
          />
        </CCol>
      </CRow>
    )
  }
  else {
    return (
      <Redirect to='/dashboard/admin/users' />
    )
  }
}

export default User
