import React, { useState } from 'react'
import {
    CButton, CModalHeader,
    CModalBody,
    CModalFooter, CModal
    // CCol
} from '@coreui/react'
import Items from './Items'
import CIcon from '@coreui/icons-react'
import { Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Droppable } from 'react-beautiful-dnd'
import {
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
// import Cookies from 'universal-cookie';
import axios from '../../assets/api';
// import { useHistory } from "react-router-dom";


const Column = (props) => {


    // const onDragEnds = (result) => {
        //     const { destination, source, draggableId } = result;
        //     if (!destination) return;
        //     if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        //     const start = items.columns[source.droppableId];
        //     const finish = items.columns[destination.droppableId];
        //     if (start === finish) {
        //         const newtaskIds = Array.from(start.taskIds);
        //         newtaskIds.splice(source.index, 1);
        //         newtaskIds.splice(destination.index, 0, draggableId);
        //         const newColumn = {
        //             ...start,
        //             taskIds: newtaskIds
        //         }
        //         const newState = ({
        //             ...items,
        //             columns: {
        //                 ...items.columns,
        //                 [newColumn.id]: newColumn
        //             }
        //         });
        //         setItems(newState);
        //         return;
        //     }
        //     const startTaskIds = Array.from(start.taskIds);
        //     startTaskIds.splice(source.index, 1);
        //     const newStart = {
        //         ...start,
        //         taskIds: startTaskIds
        //     }
        //     const finishTaskIds = Array.from(finish.taskIds);
        //     finishTaskIds.splice(destination.index, 0, draggableId);
        //     const newFinish = {
        //         ...finish,
        //         taskIds: finishTaskIds
        //     };
        //     const newState = {
        //         ...items,
        //         columns: {
        //             ...items.columns,
        //             [newStart.id]: newStart,
        //             [newFinish.id]: newFinish
        //         }
        //     }
        //     setItems(newState);
        //     return;
    // }



    const [delId, setDelId] = useState();
    const [modal, setModal] = useState();
    const [spin, setSpin] = useState(false);
    const [newData, setNewData] = useState(props.options);

    const showModal = (id, name) => {
        if (name === 'del') {
            setDelId(id);
        }
        setModal(true);
    }
    const notifyS = (msg) => toast.success(msg);

    const notifyF = (msg) => toast.error(msg);

    const del = (id) => {
        setSpin(true);
        axios.delete(`admin/options/${id}`).then(res => {
            setSpin(false);
            notifyS('Option deleted successful');
            setModal(false);
            let arr = props.options.filter((food) => food.id !== id)
            setNewData(arr);
        }).catch(err => {
            setSpin(false);
            notifyF(`Error ${err.response.data.msg}`);
        })
    }

    const closeModal = () => {
        setModal(false);
    }

    return (
        <div>
            {
                newData.map((option, index) => {
                    return (
                        <AccordionItem key={index} uuid={index.toString()}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <span>
                                        {option.name} ({option.price})$
                                    </span>
                                    {console.log(option.id)}
                                    <span className='action_op'>
                                        <CIcon className='text-danger' size={'md'} name={'cilTrash'} onClick={() => { showModal(option.id, 'del') }} />
                                        <CIcon className='text-success' size={'md'} name={'cilPencil'} onClick={() => { }} />
                                    </span>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <Droppable droppableId={option.name}>
                                    {
                                        (provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                key={index}
                                            >
                                                {
                                                    option.extras.map((extra, index) => (<>
                                                        <Items key={extra.id} extra={extra} index={index} />
                                                        {provided.placeholder}
                                                    </>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </Droppable>
                            </AccordionItemPanel>
                        </AccordionItem>
                    )
                })
            }
            <CModal
                show={modal}
                onClose={() => closeModal('del')}
                size={'lg'}
                color={'danger'}
            >
                <CModalHeader closeButton>Delete option</CModalHeader>
                <CModalBody>
                    You are being to delete this option are you sure ?
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={() => { del(delId) }}>
                        {spin ? <Spinner animation="border" variant="light" /> : ''}
                            Delete
                        </CButton>{' '}
                    <CButton color="secondary" onClick={() => { closeModal('del') }}>Cancel</CButton>
                </CModalFooter>
            </CModal>
            <ToastContainer
                autoClose={3000}
            />
        </div>
    )
}

export default Column
