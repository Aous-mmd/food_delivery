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

const Slider = () => {
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
        axios.get('admin/sliders').then(res => {
            setAddress(res.data.sliders);
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
        { key: 'title', label: 'Title', _style: { width: '30%' } },
        { key: 'caption', label: 'Description', _style: { width: '30%' } },
        { key: 'image', label: 'Image', _style: { width: '30%' } },
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
            axios.post(`admin/sliders/${editId}`, editData).then(res => {
                setSpin(false);
                notifyS('Slider edited successful');
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
            axios.post('admin/sliders', formData).then(res => {
                setSpin(false);
                notifyS('Slider Added successful');
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
        axios.delete(`admin/sliders/${id}`).then(res => {
            setSpinD(false);
            notifyS('Slider deleted successful');
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
                        <CButton className='mt-3 mb-3' color={'success'} onClick={(e) => { showModal('add'); }}>Add New Slider</CButton>
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
                            scopedSlots={{
                                'image':
                                    (item, index) => {
                                        return (
                                            <td className="py-2">
                                                {
                                                    <img className='slider_img' src={item.image.image_url} alt={item.caption} />
                                                }
                                            </td>
                                        )
                                    },
                            }}
                        />
                        <CModal
                            show={modal}
                            onClose={() => closeModal('edit')}
                            size={'lg'}
                            color={'primary'}
                        >
                            <CModalHeader closeButton>Edit Slider</CModalHeader>
                            <CModalBody>
                                <Form onSubmit={(e) => submit(e, 'edit')}>
                                    <CRow>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom01">
                                            <Form.Label>Slider Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='title'
                                                defaultValue={edit.title}
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom02">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='caption'
                                                defaultValue={edit.caption}
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom03">
                                            <Form.Label>Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name='image'
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
                                        <Form.Group as={CCol} md="6" controlId="validationCustom01">
                                            <Form.Label>Slider Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='title'
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom02">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name='caption'
                                                onChange={(e) => handleChange(e, 'edit')}
                                            />
                                        </Form.Group>
                                        <Form.Group as={CCol} md="6" controlId="validationCustom03">
                                            <Form.Label>Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name='image'
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

export default Slider
