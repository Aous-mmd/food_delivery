import React, { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../../assets/api';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import {
    CButton,
    CDataTable
} from '@coreui/react';

const Feedback = () => {
    const [address, setAddress] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const cookies = new Cookies();
    const history = useHistory();

    useEffect(() => {
        axios.get('admin/orders').then(res => {
            setAddress(res.data.orders);
        }).catch(err => {
            if (err.response.status === 401) {
                cookies.remove('authCookie');
                history.push("/dashboard/admin/login");
            }
        })
        
    }, [refresh]);// eslint-disable-line react-hooks/exhaustive-deps

    const fields = [
        { key: 'customer_name', label: 'Name' },
        { key: 'customer_phone', label: 'Phone' },
        { key: 'customer_email', label: 'Email' },
        { key: 'type', label: 'Type' },
        { key: 'address', label: 'Address' },
        { key: 'total_price', label: 'Price' },
        { key: 'status', label: 'Status' },
        { key: 'action', label: 'Action'}
    ]

    const notifyS = (msg) => toast.success(msg);

    const notifyF = (msg) => toast.error(msg);

    const del = (id) => {
        axios.delete(`admin/orders/${id}`).then(res => {
            notifyS('Order deleted successful');
            setRefresh(true);
        }).catch(err => {
            notifyF(`Error ${err.response.data.msg}`);
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
                    </>
            }
            <ToastContainer
                autoClose={3000}
            />
        </div>
    )
}

export default Feedback
