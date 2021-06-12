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
        axios.get('admin/feedback').then(res => {
            setAddress(res.data.feedbacks);
        }).catch(err => {
            if (err.response.status === 401) {
                cookies.remove('authCookie');
                history.push("/dashboard/admin/login");
            }
        })
        setRefresh(false);
    }, [refresh]);// eslint-disable-line react-hooks/exhaustive-deps

    const fields = [
        { key: 'email', label: 'Email', _style: { width: '30%' } },
        { key: 'description', label: 'Message', _style: { width: '60%' } },
        { key: 'action', label: 'Action', _style: { width: '10%' } },
    ]

    const notifyS = (msg) => toast.success(msg);

    const notifyF = (msg) => toast.error(msg);

    const del = (id) => {
        axios.delete(`admin/feedback/${id}`).then(res => {
            notifyS('Feedback deleted successful');
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
