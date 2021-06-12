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

const ExtraCat = () => {
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
        axios.get('admin/extra-categories').then(res => {
            setAddress(res.data.extra_categories);
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
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' }
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
            axios.post(`admin/extra-categories/${editId}`, editData).then(res => {
                setSpin(false);
                notifyS('Extra Category edited successful');
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
            axios.post('admin/extra-categories', formData).then(res => {
                setSpin(false);
                notifyS('Extra category Added successful');
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
        axios.delete(`admin/extra-categories/${id}`).then(res => {
            setSpinD(false);
            notifyS('Extra category deleted successful');
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
                        <CButton className='mt-3 mb-3' color={'success'} onClick={(e) => { showModal('add'); }}>Add New Extra Category</CButton>
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
                            <CModalHeader closeButton>Edit Extra Category</CModalHeader>
                            <CModalBody>
                                <Form onSubmit={(e) => submit(e, 'edit')}>
                                    <CRow>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom01">
                                            <Form.Label>Extra Category</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='name'
                                                defaultValue={edit.name}
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom02">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='description'
                                                defaultValue={edit.description}
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
                            <CModalHeader closeButton>Add Extra Category</CModalHeader>
                            <CModalBody>
                                <Form onSubmit={(e) => submit(e, 'add')}>
                                    <CRow>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom01">
                                            <Form.Label>Slider Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='name'
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom02">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='description'
                                                onChange={(e) => handleChange(e, 'edit')}
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

export default ExtraCat
