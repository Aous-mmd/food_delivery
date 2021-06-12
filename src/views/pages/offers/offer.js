import React, { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { Spinner, Form } from 'react-bootstrap';
import axios from '../../../assets/api';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'

const Offer = (props) => {
    const [spin, setSpin] = useState(false);
    const [spinD, setSpinD] = useState(false);
    const history = useHistory()
    if (props.location.state) {
        const notifyS = (msg) => toast.success(msg);

        if (!props.location.state.fields) {
            history.push("/dashboard/admin/offers");
        }

        const notifyF = (msg) => toast.error(msg);
        const users = props.location.state.fields;
        const user = users.filter((user) => user.id.toString() === props.match.params.id.toString())
        const data = { ...user[0] };

        const del = (id) => {
            setSpin(true);
            axios.delete(`admin/discounts/${id}`).then(res => {
                setSpin(false);
                notifyS('deleted user successfuly');
                history.push("/dashboard/admin/offers");
            }).catch(err => {
                setSpin(false);
                notifyF('you cant delete this offer');
            })
        }
        const submit = (e) => {
            e.preventDefault();
            setSpinD(true);
            let newData = new FormData(e.currentTarget);
            axios.post(`admin/discounts/${props.match.params.id}`, newData).then(res => {
                setSpinD(false);
                notifyS('offer edited successfully');
                history.push('/dashboard/admin/offers')
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
                                    <Form.Group as={CCol} md="12" controlId="validationCustom01">
                                        <Form.Label>Food Name : {data.name}</Form.Label>
                                        <Form.Control
                                            disabled
                                            hidden
                                            type="text"
                                            defaultValue={data.category_id}
                                            name='name'
                                        />
                                    </Form.Group>
                                    <Form.Group as={CCol} md="6">
                                        <Form.Label>Select offer day</Form.Label>
                                        <Form.Control as="select" name='day' controlId='validationCustom15' custom>
                                            <option selected={data.day === 'Saturday' ? 'selected' : ''}>Saturday</option>
                                            <option selected={data.day === 'Sunday' ? 'selected' : ''}>Sunday</option>
                                            <option selected={data.day === 'Monday' ? 'selected' : ''}>Monday</option>
                                            <option selected={data.day === 'Tuesday' ? 'selected' : ''}>Tuesday</option>
                                            <option selected={data.day === 'Wednesday' ? 'selected' : ''}>Wednesday</option>
                                            <option selected={data.day === 'Thursday' ? 'selected' : ''}>Thursday</option>
                                            <option selected={data.day === 'Friday' ? 'selected' : ''}>Friday</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group as={CCol} md="6" controlId="validationCustom03">
                                        <Form.Label>Amount €</Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={data.amount}
                                            name='amount'
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
            <Redirect to='/dashboard/admin/offers' />
        )
    }
}

export default Offer
