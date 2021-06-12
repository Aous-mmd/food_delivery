import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { Spinner, Form } from 'react-bootstrap';
import axios from '../../assets/api';
import Cookies from 'universal-cookie';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react'

const Users = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [spin, setSpin] = useState(false);
  const cookies = new Cookies();

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/dashboard/admin/users?page=${newPage}`)
  }

  const notifyS = (msg) => toast.success(msg);

  const notifyF = (msg) => toast.error(msg);

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  useEffect(() => {
    axios.get('admin/users').then(res => {
      setData(res.data.users);
    }).catch(err => {
      if (err.response.status === 401) {
        cookies.remove('authCookie');
        history.push("/dashboard/admin/login");
      }
    })
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const fetchUser = () => {
    axios.get('admin/users').then(res => {
      setData(res.data.users);
    }).catch(err => {
      if (err.response.status === 401) {
        cookies.remove('authCookie');
        history.push("/dashboard/admin/login");
      }
    })
  }

  const closeModal = () => {
    setModal(false);
  }
  const submit = (e) => {
    e.preventDefault();
    setSpin(true);
    let newData = new FormData(e.currentTarget);
    axios.post('admin/users', newData).then(res => {
      setSpin(false);
      notifyS('User added successfuly');
      fetchUser();
      setModal(false);
    }).catch(err => {
      setSpin(false);
      notifyF(`${err.response.data.msg}`);
    })
  }


  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            <CButton color={'primary'} onClick={() => setModal(true)}>Add User</CButton>
          </CCardHeader>
          <CCardBody>
            {
              data.length < 1 ?
                <div className='empty'>
                  <Spinner animation="border" />
                </div> :
                <>
                  <CDataTable
                    items={data}
                    tableFilter
                    fields={[
                      'first_name', 'last_name', 'name', 'phone', 'email'
                    ]}
                    hover
                    sorter
                    striped
                    responsive={true}
                    itemsPerPageSelect
                    itemsPerPage={5}
                    activePage={page}
                    clickableRows
                    onRowClick={(item) => history.push({ pathname: `/dashboard/admin/users/${item.id}`, state: { data } })}
                  />
                  <CPagination
                    activePage={page}
                    onActivePageChange={pageChange}
                    pages={5}
                    doubleArrows={false}
                    align="center"
                  />
                  <CModal
                    show={modal}
                    onClose={() => closeModal()}
                    size={'lg'}
                    color={'primary'}
                  >
                    <CModalHeader closeButton>Add User</CModalHeader>
                    <CModalBody>
                      <Form onSubmit={(e) => submit(e)}>
                        <CRow>
                          <Form.Group as={CCol} md="6" controlId="validationCustom01">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder='first name'
                              name='first_name'
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="6" controlId="validationCustom02">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder='last name'
                              name='last_name'
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="6" controlId="validationCustom03">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder='username'
                              name='name'
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="6" controlId="validationCustom04">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder='+21545484'
                              name='phone'
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="6" controlId="validationCustom05">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              required
                              type="email"
                              placeholder='your@email.com'
                              name='email'
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="6" controlId="validationCustom06">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder='password'
                              name='password'
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="6" controlId="validationCustom07">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder='confirm password'
                              name='password_confirmation'
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="6" controlId="validationCustom08">
                            <Form.Label>User image</Form.Label>
                            <Form.Control
                              required
                              type="file"
                              name='image'
                            />
                          </Form.Group>
                        </CRow>
                        <CModalFooter>
                          <CButton type='submit' color="primary">
                            {spin ? <Spinner animation="border" variant="light" /> : ''}
                              Save
                          </CButton>{' '}
                          <CButton color="secondary" onClick={() => closeModal()}>Cancel</CButton>
                        </CModalFooter>
                      </Form>
                    </CModalBody>
                  </CModal>
                </>
            }
          </CCardBody>
        </CCard>
        <ToastContainer
          autoClose={3000}
        />
      </CCol>
    </CRow>
  )
}

export default Users
