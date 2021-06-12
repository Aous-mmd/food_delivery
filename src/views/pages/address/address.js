import React, { useState, useEffect } from 'react'
import { Spinner, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import axios from '../../../assets/api';
import { useHistory } from "react-router-dom";
import {
    CButton,
    CModal,
    CCol,
    CRow,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CDataTable
} from '@coreui/react';

const Address = () => {
    const [address, setAddress] = useState([]);
    const [modal, setModal] = useState(false);
    const [spin, setSpin] = useState(false);
    const [spinD, setSpinD] = useState(false);
    const [edit, setEdit] = useState({});
    const [editData, setEditData] = useState([]);
    const [editId, setEditId] = useState();
    const [add, setAdd] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const history = useHistory();
    const cookies = new Cookies();

    useEffect(() => {
        axios.get('admin/delivery-addresses').then(res => {
            setAddress(res.data.addresses);
        }).catch(err => {
            if (err.response.status === 401) {
                cookies.remove('authCookie');
                history.push("/dashboard/admin/login");
            }
        })
        setEdit({});
        setRefresh(false);
    }, [refresh]);// eslint-disable-line react-hooks/exhaustive-deps

    const fields = [
        { key: 'id', label: 'ID', _style: { width: '10%' } },
        { key: 'name', label: 'Name', _style: { width: '30%' } },
        { key: 'code', label: 'Zip code', _style: { width: '20%' } },
        { key: 'delivery_cost', label: 'Delivery cost', _style: { width: '20%' } },
        { key: 'min_delivery', label: 'Min order cost', _style: { width: '20%' } },
    ]

    const clickedRow = (e) => {
        setEdit(e);
        setEditId(e.id);
        setModal(true);
    }

    const notifyS = (msg) => toast.success(msg);

    const notifyF = (msg) => toast.error(msg);

    const submit = (e, name) => {
        e.preventDefault();
        if (name === 'edit') {
            setSpin(true);
            axios.post(`admin/delivery-addresses/${editId}`, editData).then(res => {
                setSpin(false);
                notifyS('Address edited successful');
                setRefresh(true);
                setModal(false);
            }).catch(err => {
                setSpin(false);
                notifyF(`Error ${err.response.data.msg}`);
            })
        }
        else {
            var formData = new FormData(e.currentTarget);
            setSpin(true);
            axios.post('admin/delivery-addresses', formData).then(res => {
                setSpin(false);
                notifyS('Address Added successful');
                setRefresh(true);
                setAdd(false);
            }).catch(err => {
                setSpin(false);
                notifyF(`Error ${err.response.data.msg}`);
            })
        }
    }

    const del = (id) => {
        setSpinD(true);
        axios.delete(`admin/delivery-addresses/${id}`).then(res => {
            setSpinD(false);
            notifyS('Address deleted successful');
            setModal(false);
            setRefresh(true);
        }).catch(err => {
            setSpinD(false);
            notifyF(`Error ${err.response.data.msg}`);
        })
    }

    const showModal = (name) => {
        if (name === 'add') {
            setAdd(true);
        }
    }

    const closeModal = (name) => {
        if (name === 'add') {
            setAdd(false);
        }
        else {
            setModal(false);
        }
    }

    const handleChange = (e, name) => {
        if (name === 'edit') {
            setEditData({ ...editData, [e.target.name]: e.target.value })
        }
    }

    return (
        <div className='table_address'>
            {
                address.length < 1 ?
                    <div className='empty'>
                        <Spinner animation="border" />
                    </div> :
                    <>
                        <CButton className='mt-3 mb-3' color={'success'} onClick={(e) => { showModal('add'); }}>Add New Address</CButton>
                        <CDataTable
                            className='table'
                            items={address}
                            fields={fields}
                            tableFilter
                            clickableRows={true}
                            onRowClick={(e) => clickedRow(e)}
                            responsive={true}
                            itemsPerPageSelect
                            itemsPerPage={5}
                            hover
                            sorter
                            pagination
                        />
                        <CModal
                            show={modal}
                            onClose={() => closeModal('edit')}
                            size={'lg'}
                            color={'primary'}
                        >
                            <CModalHeader closeButton>Edit Address</CModalHeader>
                            <CModalBody>
                                <Form onSubmit={(e) => submit(e, 'edit')}>
                                    <CRow>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom01">
                                            <Form.Label>Address Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='name'
                                                defaultValue={edit.name}
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom02">
                                            <Form.Label>Zip Code</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name='code'
                                                defaultValue={edit.code}
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom03">
                                            <Form.Label>Delivery cost</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name='delivery_cost'
                                                defaultValue={edit.delivery_cost}
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom04">
                                            <Form.Label>Min Cost</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                defaultValue={edit.min_delivery}
                                                name='min_delivery'
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                    </CRow>
                                    <CModalFooter>
                                        <CButton color="danger" onClick={() => del(editId)}>
                                            {spinD ? <Spinner animation="border" variant="light" /> : ''}
                                                    Delete
                                                </CButton>
                                        <CButton type='submit' color="primary">
                                            {spin ? <Spinner animation="border" variant="light" /> : ''}
                                                    Save
                                                </CButton>{' '}
                                        <CButton color="secondary" onClick={() => closeModal('edit')}>Cancel</CButton>
                                    </CModalFooter>
                                </Form>
                            </CModalBody>
                        </CModal>
                        <CModal
                            show={add}
                            onClose={() => closeModal('add')}
                            size={'lg'}
                            color={'success'}
                        >
                            <CModalHeader closeButton>Add Address</CModalHeader>
                            <CModalBody>
                                <Form onSubmit={(e) => submit(e, 'add')}>
                                    <CRow>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom06">
                                            <Form.Label>City Name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name='name'
                                                placeholder='City Name'
                                                onChange={(e) => handleChange(e, 'add')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom07">
                                            <Form.Label>Zip Code</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                name='code'
                                                placeholder='Zip Code'
                                                onChange={(e) => handleChange(e, 'add')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom08">
                                            <Form.Label>Delivery cost</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                name='delivery_cost'
                                                placeholder='50'
                                                onChange={(e) => handleChange(e, 'add')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom09">
                                            <Form.Label>Min Cost</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                placeholder='50'
                                                name='min_delivery'
                                                onChange={(e) => handleChange(e, 'add')}
                                            />
                                        </Form.Group>
                                    </CRow>
                                    <CModalFooter>
                                        <CButton type='submit' color="success">
                                            {spin ? <Spinner animation="border" variant="light" /> : ''}
                                                    Save
                                                </CButton>{' '}
                                        <CButton color="secondary" onClick={() => { closeModal('add') }}>Cancel</CButton>
                                    </CModalFooter>
                                </Form>
                            </CModalBody>
                        </CModal>
                    </>
            }
            <ToastContainer
                autoClose={3000}
            />
        </div>
    )
}

export default Address
