import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { Spinner, Form } from 'react-bootstrap';
import axios from '../../../assets/api';
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
import Select from 'react-select'


const Offers = () => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [spin, setSpin] = useState(false);
    const [cats, setCats] = useState([]);
    const cookies = new Cookies();

    const pageChange = newPage => {
        currentPage !== newPage && history.push(`/dashboard/admin/offers?page=${newPage}`)
    }

    const notifyS = (msg) => toast.success(msg);

    const notifyF = (msg) => toast.error(msg);

    useEffect(() => {
        currentPage !== page && setPage(currentPage)
    }, [currentPage, page])

    useEffect(() => {
        axios.get('admin/discounts').then(res => {
            setData(res.data.discounts);
        }).catch(err => {
            if (err.response.status === 401) {
                cookies.remove('authCookie');
                history.push("/dashboard/admin/login");
            }
        })
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const fetchUser = () => {
        axios.get('admin/discounts').then(res => {
            setData(res.data.discounts);
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
        axios.post('admin/discounts', newData).then(res => {
            setSpin(false);
            notifyS('Offer added successfuly');
            fetchUser();
            setModal(false);
        }).catch(err => {
            setSpin(false);
            notifyF(`${err.response.data.msg}`);
        })
    }
    const fields = [];// eslint-disable-next-line
    data.map((item) => {
        fields.push({ ...item, name: item.category.name })
    });

    const callData = () => {
        axios.get('admin/categories').then(res => {
            let data = [];
            // eslint-disable-next-line
            res.data.categories.map((item) => {
                console.log(item);
                data.push({ 'value': item.id, 'id': item.id, 'label': item.name });
            });

            setCats(data);
        })
    }

    return (
        <CRow>
            <CCol xl={12}>
                <CCard>
                    <CCardHeader>
                        <CButton color={'primary'} onClick={() => { callData(); setModal(true) }}>Add Offer</CButton>
                    </CCardHeader>
                    <CCardBody>
                        {
                            data.length < 1 ?
                                <div className='empty'>
                                    <Spinner animation="border" />
                                </div> :
                                <>
                                    <CDataTable
                                        items={fields}
                                        tableFilter
                                        fields={[
                                            { label: 'Name', key: 'name' }, { label: 'Day', key: 'day' }, { label: 'Amount', key: 'amount' }
                                        ]}
                                        hover
                                        sorter
                                        striped
                                        responsive={true}
                                        itemsPerPageSelect
                                        itemsPerPage={5}
                                        activePage={page}
                                        clickableRows
                                        onRowClick={(item) => history.push({ pathname: `/dashboard/admin/offers/${item.id}`, state: { fields } })}
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
                                        <CModalHeader closeButton>Add Offer</CModalHeader>
                                        <CModalBody>
                                            <Form onSubmit={(e) => submit(e)}>
                                                <CRow>
                                                    <Form.Group as={CCol} md="12" controlid="validationCustom03">
                                                        <Form.Label>Select Category</Form.Label>
                                                        <Select name='category_id' required options={cats} />
                                                    </Form.Group>
                                                    <Form.Group as={CCol} md="6" controlid="validationCustom03">
                                                        <Form.Label>Amount €</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder='15€'
                                                            name='amount'
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={CCol} md="6">
                                                        <Form.Label>Select offer day</Form.Label>
                                                        <Form.Control as="select" name='day' required controlid='validationCustom15' custom>
                                                            <option>Saturday</option>
                                                            <option>Sunday</option>
                                                            <option>Monday</option>
                                                            <option>Tuesday</option>
                                                            <option>Wednesday</option>
                                                            <option>Thursday</option>
                                                            <option>Friday</option>
                                                        </Form.Control>
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

export default Offers
