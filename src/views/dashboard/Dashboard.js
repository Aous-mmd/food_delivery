import React, { useState, useEffect } from 'react'
import {
  CCol,
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { Spinner, Form } from 'react-bootstrap';
import {
  Accordion,
  // AccordionItem,
  // AccordionItemHeading,
  // AccordionItemButton,
  // AccordionItemPanel,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';
import CIcon from '@coreui/icons-react'
import { ToastContainer, toast } from 'react-toastify';
import Column from './Column';
import axios from '../../assets/api';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd'

const Dashboard = () => {
  const [cats, setCats] = useState([]);
  const [catId, setCatId] = useState();
  const [foods, setFoods] = useState([]);
  const [foodId, setFoodId] = useState();
  const [options, setOptions] = useState([]);
  const [data, setData] = useState({});
  const [dOption, setDOption] = useState(false);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [add, setAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [spin, setSpin] = useState(false);
  const [spinO, setSpinO] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isCat, setIsCat] = useState(false);
  const [isFood, setIsFood] = useState(false);
  const [isOption, setIsOption] = useState(false);
  // eslint-disable-next-line
  const [isExtra, setIsExtra] = useState(false);
  const [hasExtra, setHasExtra] = useState(false);
  const [editable, setEditable] = useState([]);
  const [editableN, setEditableN] = useState([]);
  const [store, setStore] = useState({});
  const [dFood, setdFood] = useState(false);
  const [formErr, setFormErr] = useState(false);
  const cookies = new Cookies();
  const history = useHistory();

  useEffect(() => {
    setSpin(true)
    axios.get('admin/categories').then(res => { setCats(res.data.categories); setSpin(false) }).catch(err => {
      if (err.response.status === 401) {
        cookies.remove('authCookie');
        history.push("/dashboard/admin/login");
      }
    })
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const notifyS = (msg) => toast.success(msg);

  const notifyF = (msg) => toast.error(msg);

  const Delete = (id) => {
    let url = '';
    if (isCat) {
      url = 'categories';
    }
    else if (isFood) {
      url = 'foods';
    }
    else if (isOption) {
      url = 'options';
    }
    else {
      url = 'extra';
    }
    setSpin(true);
    axios.delete(`admin/${url}/${id}`).then(res => {
      notifyS('Delete successfully');
      setSpin(false);
      setRefresh(true);
    }).catch(err => {
      if (err.response.status === 401) {
        cookies.remove('authCookie');
        history.push("/dashboard/admin/login");
      }
      notifyF('Error you cant delete this item');
      setSpin(false);
    })
  }

  const showModal = (name, id, type) => {
    if (name === 'edit') {
      setEdit(true);
      let newIt;
      if (type === 'cat') {
        newIt = cats.filter((cat) => cat.id === id);
        delete newIt.image;
      }
      else if (type === 'food') {
        newIt = foods.filter((food) => food.id === id);
      }
      setEditable(...newIt);
    }
    else if (name === 'del') {
      setDel(!del);
      setDeleteId(id);
    }
    else if (name === 'add') {
      setAdd(true);
    }
  }

  const CloseModals = () => {
    setEdit(false);
    setDel(false);
    setAdd(false);
    setEditable({});
    setIsFood(false);
    setIsCat(false);
    setIsExtra(false);
    setIsOption(false);
  }

  const handleChange = (e, name) => {
    if (name === 'edit') {
      if (e.target.name === 'image') {
        setEditable({ ...editable, image: e.target.files[0] });
        setEditableN({ ...editableN, [e.target.name]: e.target.files[0] });
      }
      else {
        setEditable({ ...editable, name: e.target.value });
        setEditableN({ ...editableN, [e.target.name]: e.target.value });
      }
    }
    else {
      if (e.target.name === 'image') {
        setStore({ ...store, [e.target.name]: e.target.files[0] });
      }
      else if (e.target.name === 'switch') {
        if (e.target.checked) {
          setHasExtra(true);
        }
        else {
          setHasExtra(false);
        }
      }
      else {
        setStore({ ...store, [e.target.name]: e.target.value })
      }
    }
  }

  const submit = (e, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCat) {
      if (name === 'add') {
        if (Object.keys(store).length === 4) {
          let newData = new FormData();
          for (const [key, value] of Object.entries(store)) {
            newData.append(key, value);
          }
          setSpin(true);
          axios.post('admin/categories', newData).then(res => {
            notifyS('Added Category successfully');
            setSpin(false);
            setRefresh(true);
          }).catch(err => {
            if (err.response.status === 401) {
              cookies.remove('authCookie');
              history.push("/dashboard/admin/login");
            }
            notifyF(`Error ${err.response.data.errors}`);
            setSpin(false);
          })
        }
        else {
          setFormErr(true);
        }
      }
      else if (name === 'edit') {
        let id = editable.id;
        let newData = new FormData();
        for (const [key, value] of Object.entries(editableN)) {
          newData.append(key, value);
        }
        setSpin(true);
        axios.post(`admin/categories/${id}`, newData).then(res => {
          notifyS('Edited Category successfully');
          setSpin(false);
          setRefresh(true);
        }).catch(err => {
          if (err.response.status === 401) {
            cookies.remove('authCookie');
            history.push("/dashboard/admin/login");
          }
          notifyF(`Error ${err.response.data.errors}`);
          setSpin(false);
        })
      }
    }
    else if (isFood) {
      if (name === 'add') {
        let newData = new FormData();
        for (const [key, value] of Object.entries(store)) {
          newData.append(key, value);
        }
        newData.append('category_id', catId);
        setSpin(true);
        axios.post('admin/foods', newData).then(res => {
          notifyS('Added Category successfully');
          setSpin(false);
          setRefresh(true);
        }).catch(err => {
          if (err.response.status === 401) {
            cookies.remove('authCookie');
            history.push("/dashboard/admin/login");
          }
          notifyF(`Error ${err.response.data.errors}`);
          setSpin(false);
        })
      }
      else if (name === 'edit') {
        let id = editable.id;
        let newData = new FormData();
        for (const [key, value] of Object.entries(editableN)) {
          newData.append(key, value);
        }
        setSpin(true);
        axios.post(`admin/foods/${id}`, newData).then(res => {
          notifyS('Edited Category successfully');
          setSpin(false);
          setRefresh(true);
        }).catch(err => {
          if (err.response.status === 401) {
            cookies.remove('authCookie');
            history.push("/dashboard/admin/login");
          }
          notifyF(`Error ${err.response.data.errors}`);
          setSpin(false);
        })
      }
    }
    else if (isOption) {
      if (name === 'add') {
        let newData = new FormData();
        for (const [key, value] of Object.entries(store)) {
          newData.append(key, value);
        }
        newData.append('food_id', foodId);
        setSpin(true);
        axios.post('admin/options', newData).then(res => {
          notifyS('Added Option successfully');
          setSpin(false);
          setRefresh(true);
        }).catch(err => {
          if (err.response.status === 401) {
            cookies.remove('authCookie');
            history.push("/dashboard/admin/login");
          }
          notifyF(`Error ${err.response.data.errors}`);
          setSpin(false);
        })
      }
      else if (name === 'edit') {
        let id = editable.id;
        let newData = new FormData();
        for (const [key, value] of Object.entries(editableN)) {
          newData.append(key, value);
        }
        setSpin(true);
        axios.post(`admin/options/${id}`, newData).then(res => {
          notifyS('Edited Option successfully');
          setSpin(false);
          setRefresh(true);
        }).catch(err => {
          if (err.response.status === 401) {
            cookies.remove('authCookie');
            history.push("/dashboard/admin/login");
          }
          notifyF(`Error ${err.response.data.errors}`);
          setSpin(false);
        })
      }
    }
  }

  useEffect(() => {
    if (isCat) {
      axios.get('admin/categories').then(res => {
        setCats(res.data.categories);
      }).catch(err => {
        if (err.response.status === 401) {
          cookies.remove('authCookie');
          history.push("/dashboard/admin/login");
        }
      })
    }
    else if (isFood) {
      fetchFood(catId);
    }
    else if(isOption) {
      fetchOptions(foodId);
    }
    setAdd(false);
    setDel(false);
    setEdit(false);
    setRefresh(false);
  }, [refresh]);// eslint-disable-line react-hooks/exhaustive-deps

  const fetchFood = (id) => {
    setCatId(id);
    setdFood(true);
    setSpin(true);
    setFoods([]);
    axios.get(`admin/category/${id}/foods`).then(res => {
      setSpin(false);
      if (res.data.foods.length >= 1) {
        setFoods(res.data.foods)
      }
    })
  }
  const fetchOptions = (id) => {
    setFoodId(id);
    setData({});
    setDOption(true);
    setSpinO(true);
    setOptions([]);
    axios.get(`admin/food/${id}/options`).then(res => {
      setSpinO(false);
      if (res.data.options.length >= 1) {
        let obj = {};
        let arr = [];
        // eslint-disable-next-line
        res.data.options.map((item, index) => {
          let extras = [];
          // eslint-disable-next-line
          item.food_options.map((options) => {
            // eslint-disable-next-line
            options.extras.map((extra) => {
              extras.push(extra);
            })
          })
          obj = Object.assign({}, { ...obj }, {
            [`option-${index + 1}`]: {
              id: item.id,
              optionID: `option-${index + 1}`,
              price: item.food_options[0].price,
              name: item.name,
              extras: extras
            }
          })
          arr.push(`option-${index + 1}`);
        })
        setData({
          options: obj,
          columns: {
            'column-1': {
              id: 'column-1',
              optionsID: arr
            }
          },
          columnOrder: ['column-1']
        })
      }
    })
  }
  const onDragEnds = (result) => {
  }
  return (
    <>
      <CRow>
        <CCol lg='3' md='6' sm='12' className='items'>
          <div className='conts'>
            <div className='header'>
              <h1>Categories</h1>
              <CButton color="primary" onClick={() => { setIsCat(true); showModal('add'); }}>Add New Category</CButton>
            </div>
            {
              cats.length >= 1 ? cats.map((item, index) => (
                <div className='item' key={index}>
                  <div className='img'>
                    <img src={item.image ? item.image.image_url : '/no-image.png'} alt={item.description} />
                  </div>
                  <div className='content'>
                    <h6>
                      {item.name}
                    </h6>
                    <span>
                      {item.description}
                    </span>
                  </div>
                  <div className='action'>
                    <CIcon className='text-danger' size={'lg'} name={'cilTrash'} onClick={() => { setIsCat(true); showModal('del', item.id, 'cat'); }} />
                    <CIcon className='text-success' size={'lg'} name={'cilPencil'} onClick={() => { setIsCat(true); showModal('edit', item.id, 'cat'); }} />
                    <CIcon className='text-info' size={'lg'} name={'cilSettings'} onClick={() => { fetchFood(item.id) }} />
                  </div>
                </div>

              )) : <div className="empty">{spin ? <Spinner animation="border" /> : 'There is no category'}</div>
            }
          </div>
        </CCol>
        <CCol lg='3' md='6' sm='12' className='items'>
          <div className='conts'>
            <div className='header'>
              <h1>Foods</h1>
              <CButton color="primary" disabled={dFood ? false : true} onClick={() => { setIsFood(true); showModal('add'); }}>Add New Food</CButton>
            </div>
            {
              foods.length >= 1 ? foods.map((item, index) => (
                <div className='item food' key={index}>
                  <div className='content'>
                    <h6>
                      {item.name}
                    </h6>
                    <span>
                      {item.description}
                    </span>
                  </div>
                  <div className='action'>
                    <CIcon className='text-danger' size={'lg'} name={'cilTrash'} onClick={() => { setIsFood(true); showModal('del', item.id, 'food'); }} />
                    <CIcon className='text-success' size={'lg'} name={'cilPencil'} onClick={() => { setIsFood(true); showModal('edit', item.id, 'food'); }} />
                    <CIcon className='text-info' size={'lg'} name={'cilSettings'} onClick={() => { setIsFood(true); fetchOptions(item.id); }} />
                  </div>
                </div>
              )) : <div className="empty">{spin ? <Spinner animation="border" /> : dFood ? 'There is no foods for this category' : 'Please select category to show foods'}</div>
            }
          </div>
        </CCol>
        <DragDropContext
          onDragEnd={onDragEnds}
        >
          <CCol lg='3' md='6' sm='12' className='items'>
            <div className='conts'>
              <div className='header'>
                <h1>Options</h1>
                <CButton color="danger">Cancel</CButton>
                <CButton color="success">Save</CButton>
                <CButton color="primary" disabled={dOption ? false : true} onClick={() => { setIsCat(false); setIsFood(false); setIsOption(true); showModal('add'); }}>Add New Option</CButton>
              </div>
              {
                <Accordion preExpanded={'0'}>
                  {
                    data ? data.columnOrder ? data.columnOrder.map((item, index) => {
                      const column = data.columns[item];
                      const opts = column.optionsID.map(optID => data.options[optID]);
                      return (
                        <Column key={column.id} column={column} options={opts} />
                      )
                    }) : '' : ''
                  }
                </Accordion>
              }
            </div>
          </CCol>
          <CCol lg='3' md='6' sm='12' className='items'>
            <div className='conts'>
              <div className='header'>
                <h1>Extras</h1>
                <CButton color="primary">Add New Extra</CButton>
              </div>
              {
                options.length >= 1 ? <>
                  {
                    options.map((item, index) => {
                      return (
                        <div
                          className="characters">
                          {item.name}
                        </div>
                      )
                    })
                  }
                </> : <div className="empty">{spinO ? <Spinner animation="border" /> : dOption ? 'There is no options for this food' : 'Please select food to show options'}</div>
              }
            </div>
          </CCol>
        </DragDropContext>
      </CRow>
      <ToastContainer
        autoClose={3000}
      />
      <CModal
        show={edit || del || add ? true : false}
        onClose={() => { CloseModals() }}
        color={edit ? 'success' : del ? 'danger' : add ? 'primary' : ''}
        size='lg'
      >

        {
          edit ?
            isCat ? <>
              <CModalHeader closeButton>
                <CModalTitle>Edit Category</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <Form onSubmit={(e) => submit(e, 'edit')}>
                  <CRow>
                    <Form.Group as={CCol} md="12" controlId="validationCustom01">
                      <Form.Label>Category Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name='name'
                        placeholder="Category Name"
                        onChange={(e) => handleChange(e, 'edit')}
                        defaultValue={editable ? editable.name : ''}
                      />
                    </Form.Group>
                    <Form.Group as={CCol} md="12" controlId="validationCustom02">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name='description'
                        placeholder="Description"
                        onChange={(e) => handleChange(e, 'edit')}
                        defaultValue={editable ? editable.description : ''}
                      />
                    </Form.Group>
                    <Form.Group as={CCol} md="12" controlId="validationCustom02">
                      <Form.Label>Priority</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name='order'
                        onChange={(e) => handleChange(e, 'edit')}
                        defaultValue={editable ? editable.order : ''}
                      />
                    </Form.Group>
                    <Form.Group as={CCol} md='12' controlId='file'>
                      <Form.File id="file">
                        <Form.File.Label>Please choose category image</Form.File.Label>
                        <Form.File.Input onChange={(e) => handleChange(e, 'edit')} name='image' />
                      </Form.File>
                    </Form.Group>
                    {formErr ? <div className='text-danger ml-3'><h4>Image filed are required</h4></div> : ''}
                  </CRow>
                  <CModalFooter>
                    <CButton type='submit' color="success">
                      {spin ? <Spinner animation="border" variant="light" /> : ''}
                      Save
                    </CButton>{' '}
                    <CButton color="secondary" onClick={() => CloseModals()}>Cancel</CButton>
                  </CModalFooter>
                </Form>
              </CModalBody>
            </> :
              isFood ? <>
                <CModalHeader closeButton>
                  <CModalTitle>Edit Food</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <Form onSubmit={(e) => submit(e, 'edit')}>
                    <CRow>
                      <Form.Group as={CCol} md="12" controlId="validationCustom01">
                        <Form.Label>Food Name</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name='name'
                          placeholder="Food Name"
                          onChange={(e) => handleChange(e, 'edit')}
                          defaultValue={editable ? editable.name : ''}
                        />
                      </Form.Group>
                      <Form.Group as={CCol} md="12" controlId="validationCustom02">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name='description'
                          placeholder="Description"
                          onChange={(e) => handleChange(e, 'edit')}
                          defaultValue={editable ? editable.description : ''}
                        />
                      </Form.Group>
                    </CRow>
                    <CModalFooter>
                      <CButton type='submit' color="success">
                        {spin ? <Spinner animation="border" variant="light" /> : ''}
                      Save
                    </CButton>{' '}
                      <CButton color="secondary" onClick={() => CloseModals()}>Cancel</CButton>
                    </CModalFooter>
                  </Form>
                </CModalBody></> : '' :
            del ? <>
              <CModalHeader closeButton>
                <CModalTitle>Warning</CModalTitle>
              </CModalHeader>
              <CModalBody>
                You are about to delete this from our records are you sure ?
            </CModalBody>
              <CModalFooter>
                <CButton color="danger" onClick={() => Delete(deleteId)}>
                  {spin ? <Spinner animation="border" variant="light" /> : ''}
                  Delete
                </CButton>{' '}
                <CButton color="secondary" onClick={() => CloseModals()}>Cancel</CButton>
              </CModalFooter>
            </>
              : add ?
                isCat ?
                  <>
                    <CModalHeader closeButton>
                      <CModalTitle>Add Category</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <Form onSubmit={(e) => submit(e, 'add')}>
                        <CRow>
                          <Form.Group as={CCol} md="12" controlId="validationCustom01">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              name='name'
                              placeholder="Category Name"
                              onChange={(e) => handleChange(e, 'add')}
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="12" controlId="validationCustom02">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              name='description'
                              placeholder="Description"
                              onChange={(e) => handleChange(e, 'add')}
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md="12" controlId="validationCustom02">
                            <Form.Label>Priority</Form.Label>
                            <Form.Control
                              required
                              type="number"
                              name='order'
                              onChange={(e) => handleChange(e, 'add')}
                            />
                          </Form.Group>
                          <Form.Group as={CCol} md='12' controlId='file'>
                            <Form.File id="file">
                              <Form.File.Label>Please choose category image</Form.File.Label>
                              <Form.File.Input onChange={(e) => handleChange(e, 'add')} name='image' />
                            </Form.File>
                          </Form.Group>
                          {formErr ? <div className='text-danger ml-3'><h4>Image filed are required</h4></div> : ''}
                        </CRow>
                        <CModalFooter>
                          <CButton type='submit' color="primary">
                            {spin ? <Spinner animation="border" variant="light" /> : ''}
                        Save
                      </CButton>{' '}
                          <CButton color="secondary" onClick={() => CloseModals()}>Cancel</CButton>
                        </CModalFooter>
                      </Form>
                    </CModalBody>
                  </> :
                  isFood ?
                    <>
                      <CModalHeader closeButton>
                        <CModalTitle>Add Food</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <Form onSubmit={(e) => submit(e, 'add')}>
                          <CRow>
                            <Form.Group as={CCol} md="12" controlId="validationCustom01">
                              <Form.Label>Food Name</Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name='name'
                                placeholder="Food Name"
                                onChange={(e) => handleChange(e, 'add')}
                              />
                            </Form.Group>
                            <Form.Group as={CCol} md="12" controlId="validationCustom02">
                              <Form.Label>Description</Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name='description'
                                placeholder="Description"
                                onChange={(e) => handleChange(e, 'add')}
                              />
                            </Form.Group>
                            <Form.Group as={CCol} md='12' controlId='file'>
                              <Form.File id="file">
                                <Form.File.Label>Please choose food image</Form.File.Label>
                                <Form.File.Input onChange={(e) => handleChange(e, 'add')} name='image' />
                              </Form.File>
                            </Form.Group>
                            <Form.Group as={CCol} md="6" controlId="validationCustom02">
                              <Form.Check
                                type="switch"
                                name='switch'
                                onChange={(e) => handleChange(e, 'add')}
                                id="custom-switch"
                                label="check if it has options"
                              />
                            </Form.Group>
                            <Form.Group as={CCol} md="6" controlId="validationCustom02">
                              <Form.Label>Price</Form.Label>
                              <Form.Control
                                type="number"
                                name='price'
                                placeholder="0.00$"
                                disabled={hasExtra ? true : false}
                                onChange={(e) => handleChange(e, 'add')}
                              />
                            </Form.Group>
                            {formErr ? <div className='text-danger ml-3'><h4>Image filed are required</h4></div> : ''}
                          </CRow>
                          <CModalFooter>
                            <CButton type='submit' color="primary">
                              {spin ? <Spinner animation="border" variant="light" /> : ''}
                              Save
                            </CButton>{' '}
                            <CButton color="secondary" onClick={() => CloseModals()}>Cancel</CButton>
                          </CModalFooter>
                        </Form>
                      </CModalBody>
                    </> :
                    isOption ?
                      <>
                        <CModalHeader closeButton>
                          <CModalTitle>Add Option</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <Form onSubmit={(e) => submit(e, 'add')}>
                            <CRow>
                              <Form.Group as={CCol} md="12" controlId="validationCustom01">
                                <Form.Label>Option Name</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  name='name'
                                  placeholder="Option Name"
                                  onChange={(e) => handleChange(e, 'add')}
                                />
                              </Form.Group>
                              <Form.Group as={CCol} md="6" controlId="validationCustom01">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  name='description'
                                  placeholder="Description"
                                  onChange={(e) => handleChange(e, 'add')}
                                />
                              </Form.Group>
                              <Form.Group as={CCol} md="6" controlId="validationCustom02">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                  type="number"
                                  name='price'
                                  placeholder="0.00$"
                                  disabled={hasExtra ? true : false}
                                  onChange={(e) => handleChange(e, 'add')}
                                />
                              </Form.Group>
                              {formErr ? <div className='text-danger ml-3'><h4>Image filed are required</h4></div> : ''}
                            </CRow>
                            <CModalFooter>
                              <CButton type='submit' color="primary">
                                {spin ? <Spinner animation="border" variant="light" /> : ''}
                              Save
                            </CButton>{' '}
                              <CButton color="secondary" onClick={() => CloseModals()}>Cancel</CButton>
                            </CModalFooter>
                          </Form>
                        </CModalBody>
                      </> : ''
                : ''
        }

      </CModal>
    </>
  )
}

export default Dashboard
