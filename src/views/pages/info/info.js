import React, { useState, useEffect } from 'react'
import { Spinner, Form } from 'react-bootstrap';
import {
    CRow,
    CCol,
    CButton
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../../assets/api';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";


const Info = () => {

    const [spin, setSpin] = useState(false);
    const [data, setData] = useState({});
    const cookies = new Cookies();
    const history = useHistory();

    const notifyS = (msg) => toast.success(msg);

    const notifyF = (msg) => toast.error(msg);

    useEffect(() => {
        axios.get('admin/restaurants').then(res => {
            setData(...res.data.restaurant);
            let arr = { ...res.data.restaurant };
            var selector = document.getElementById('validationCustom13');
            for (var i = 0; i < selector.length; i++) {
                if (document.getElementById('validationCustom13')[i].value === arr[0].from_day) {
                    document.getElementById('validationCustom13')[i].setAttribute('selected', 'selected');
                }
            }
            var selectorn = document.getElementById('validationCustom14');
            for (var j = 0; j < selectorn.length; j++) {
                if (document.getElementById('validationCustom14')[j].value === arr[0].to_day) {
                    document.getElementById('validationCustom14')[j].setAttribute('selected', 'selected');
                }
            }
        }).catch(err => {
            if (err.response.status === 401) {
                cookies.remove('authCookie');
                history.push("/dashboard/admin/login");
            }
        });
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const submit = (e) => {
        e.preventDefault();
        var formData = new FormData(e.currentTarget);
        setSpin(true);
        axios.post(`admin/restaurants/1`, formData).then(res => {
            setSpin(false);
            notifyS('Information updated successfuly');
        }).catch(err => {
            notifyF(`error ${err.response.data.msg}`);
        })
    }

    return (
        <div className='info'>
            <ToastContainer
                autoClose={3000}
            />
            <Form onSubmit={(e) => submit(e)}>
                <CRow>
                    <Form.Group as={CCol} md="6" controlId="validationCustom01">
                        <Form.Label>Resturant Name</Form.Label>
                        <Form.Control
                            type="text"
                            name='name'
                            defaultValue={data.name}
                            placeholder='Resturant name'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom01">
                        <Form.Label>Resturant Owner</Form.Label>
                        <Form.Control
                            type="text"
                            name='owner'
                            defaultValue={data.owner}
                            placeholder='Resturant Owner Name'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom02">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name='phone'
                            defaultValue={data.phone}
                            placeholder='+215344444'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom02">
                        <Form.Label>Min order value</Form.Label>
                        <Form.Control
                            type="number"
                            defaultValue={data.min_order}
                            name='min_order'
                            placeholder='50'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom03">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name='email'
                            defaultValue={data.email}
                            placeholder='your@email.com'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom06">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={data.address}
                            name='address'
                            placeholder='Germany, Duetch'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom04">
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={data.street}
                            name='street'
                            placeholder='example street'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom05">
                        <Form.Label>Build Number</Form.Label>
                        <Form.Control
                            defaultValue={data.build_number}
                            type="text"
                            name='build_number'
                            placeholder='1'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom07">
                        <Form.Label>Android app url</Form.Label>
                        <Form.Control
                            defaultValue={data.android_url}
                            type="text"
                            name='android_url'
                            placeholder='http://example.com'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom08">
                        <Form.Label>IOS app url</Form.Label>
                        <Form.Control
                            defaultValue={data.iphone_url}
                            type="text"
                            name='iphone_url'
                            placeholder='http://example.com'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom09">
                        <Form.Label>Facebook link</Form.Label>
                        <Form.Control
                            defaultValue={data.facebook}
                            type="text"
                            name='facebook'
                            placeholder='http://facebook.com/yourlink'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom10">
                        <Form.Label>Twitter link</Form.Label>
                        <Form.Control
                            defaultValue={data.twitter}
                            type="text"
                            name='twitter'
                            placeholder='http://twitter.com/yourlink'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom11">
                        <Form.Label>Instagram link</Form.Label>
                        <Form.Control
                            defaultValue={data.instagram}
                            type="text"
                            name='instagram'
                            placeholder='http://instagram.com/yourlink'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom12">
                        <Form.Label>Whatsapp</Form.Label>
                        <Form.Control
                            defaultValue={data.whatsapp}
                            type="text"
                            name='whatsapp'
                            placeholder='+2154354846'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="12" controlId="validationCustom18">
                        <Form.Label>Slider Image</Form.Label>
                        <Form.Control
                            type="file"
                            name='image'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom13">
                        <Form.Label>Opening day</Form.Label>
                        <Form.Control as="select" name='from_day' custom>
                            <option>Saturday</option>
                            <option>Sunday</option>
                            <option>Monday</option>
                            <option>Tuesday</option>
                            <option>Wednesday</option>
                            <option>Thursday</option>
                            <option>Friday</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom14">
                        <Form.Label>Close day</Form.Label>
                        <Form.Control as="select" name='to_day' custom>
                            <option>Saturday</option>
                            <option>Sunday</option>
                            <option>Monday</option>
                            <option>Tuesday</option>
                            <option>Wednesday</option>
                            <option>Thursday</option>
                            <option>Friday</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom15">
                        <Form.Label>Opening Time</Form.Label>
                        <Form.Control
                            defaultValue={data.open_time}
                            type="time"
                            name='open_time'
                        />
                    </Form.Group>
                    <Form.Group as={CCol} md="6" controlId="validationCustom16">
                        <Form.Label>Opening Time</Form.Label>
                        <Form.Control
                            defaultValue={data.close_time}
                            type="time"
                            name='close_time'
                        />
                    </Form.Group>
                </CRow>
                <CButton type='submit' color="primary">
                    {spin ? <Spinner animation="border" variant="light" /> : ''}
                    Save
                </CButton>{' '}
            </Form>
        </div>
    )
}

export default Info
