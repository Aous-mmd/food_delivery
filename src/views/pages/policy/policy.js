import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Spinner, Form } from 'react-bootstrap';
import axios from '../../../assets/api';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import {
    CButton,
    CDataTable,
    CCol,
    CRow,
    CModal,
    CModalBody,
    CModalHeader,
    CModalFooter
} from '@coreui/react';

const Policy = () => {
    const [address, setAddress] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [add, setAdd] = useState(false);
    const [spin, setSpin] = useState(false);
    const cookies = new Cookies();
    const history = useHistory();

    useEffect(() => {
        axios.get('admin/policies').then(res => {
            setAddress(res.data.policies);
        }).catch(err => {
            if (err.response.status === 401) {
                cookies.remove('authCookie');
                history.push("/dashboard/admin/login");
            }
        })
        setRefresh(false);
    }, [refresh]);// eslint-disable-line react-hooks/exhaustive-deps

    const fields = [
        { key: 'title', label: 'Title', _style: { width: '30%' } },
        { key: 'description', label: 'Description', _style: { width: '60%' } },
        { key: 'action', label: 'Action', _style: { width: '10%' } },
    ]

    const notifyS = (msg) => toast.success(msg);

    const notifyF = (msg) => toast.error(msg);

    const del = (id) => {
        axios.delete(`admin/policies/${id}`).then(res => {
            notifyS('Policy deleted successful');
            setRefresh(true);
        }).catch(err => {
            notifyF(`Error ${err.response.data.msg}`);
        })
    }

    const submit = (e) => {
        e.preventDefault();
        setSpin(true);
        let newData = new FormData(e.currentTarget);
        axios.post('admin/policies', newData).then(res => {
            setSpin(false);
            notifyS('Policy added successfuly');
            setRefresh(true);
            setAdd(false);
        }).catch(err => {
            setSpin(false);
            notifyF(`${err.response.data.msg}`);
        })
    }
    return (
        <div className='table_address'>
            {
                address.length < 1 ?
                    <div className='empty'>
                        <Spinner animation="border" />
                    </div> :
                    <>
                        <CButton color={'primary'} onClick={() => setAdd(true)}>Add Privacy Policy</CButton>
                        <CDataTable
                            className='table'
                            items={address}
                            fields={fields}
                            tableFilter
                            responsive={true}
                            itemsPerPageSelect
                            itemsPerPage={5}
                            hover
                            sorter
                            pagination
                            scopedSlots={{
                                'action':
                                    (item, index) => {
                                        return (
                                            <td className="py-2">
                                                <CButton
                                                    color="danger"
                                                    variant="outline"
                                                    shape="square"
                                                    size="sm"
                                                    onClick={() => { del(item.id) }}
                                                >
                                                    DELETE
                                                </CButton>
                                            </td>
                                        )
                                    },
                            }}
                        />
                        <CModal
                            show={add}
                            onClose={() => setAdd(false)}
                            color={'primary'}
                            size={'lg'}
                        >
                            <CModalHeader closeButton>Modal title</CModalHeader>
                            <CModalBody>
                                <CModalBody>
                                    <Form onSubmit={(e) => submit(e)}>
                                        <CRow>
                                            <Form.Group as={CCol} md="6" controlid="validationCustom03">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder='title'
                                                    name='title'
                                                />
                                            </Form.Group>
                                            <Form.Group as={CCol} md="6" controlid="validationCustom04">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder='Description'
                                                    name='description'
                                                />
                                            </Form.Group>
                                        </CRow>
                                        <CModalFooter>
                                            <CButton type='submit' color="primary">
                                                {spin ? <Spinner animation="border" variant="light" /> : ''}
                                                        Save
                                                    </CButton>{' '}
                                            <CButton color="secondary" onClick={() => setAdd(false)}>Cancel</CButton>
                                        </CModalFooter>
                                    </Form>
                                </CModalBody>
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

export default Policy
