import React, { useEffect, useState } from 'react'
import axios from '../../../assets/Wapi';
import { Modal, Button } from 'react-bootstrap'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Select from 'react-select';

const Home = () => {
    const [info, setInfo] = useState([]);
    const [cats, setCats] = useState([]);
    const [logo, setLogo] = useState();
    const [foods, setFoods] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(0);
    const [abholung, setAbholung] = useState(false);
    // eslint-disable-next-line 
    const [liefrung, setLiefrung] = useState(false);
    const [normal, setNormal] = useState(true);
    const [options, setOptions] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [extrasForOption, setExtrasForOption] = useState([]);
    const [currentCounter, setCurrentCounter] = useState(1);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currentEPrice, setCurrentEPrice] = useState(0);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedEPrice, setSelectedEPrice] = useState(0);
    const [choosedSize, setChoosedSize] = useState({});
    const [choosedExtras, setChoosedExtras] = useState([]);
    const [currentCart, setCurrentCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [deliveryType, setDeliveryType] = useState(false);
    const [picker, setPicker] = useState(false);
    const [address, setAddress] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [error, setError] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const [agreement, setAgreement] = useState(false);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        // setPicker(true);
        axios.get('categories').then(res => {
            setCats(res.data.Categories);
            fetchFoods(res.data.Categories[0].id);
        });

        axios.get('restaurant/get').then(res => {
            setInfo(res.data.Restaurant);
            setLogo(res.data.logo);
        });

        axios.get('address/get').then(res => {
            let obj = res.data.Addresses.map((item) => {
                return { value: item.id, label: `${item.code} - ${item.name}` }
            })
            setAddress(obj);
        });

    }, []);

    const fetchFoods = (id, indexs) => {
        document.getElementsByClassName('menu-item-name').forEach((element, index) => {
            if (index === (indexs ? indexs : 0)) {
                element.classList.add('active');
            }
            else {
                element.classList.remove('active');
            }
        });
        axios.get(`food/get/${id}`).then(res => {
            setFoods(res.data);
        });
    }

    const handleChange = (e, name) => {
        if (name === 'size') {
            setCurrentPrice(0);
            setCurrentEPrice(0);
            setSelectedEPrice(0);
            setSelectedPrice(0);
            let arr = options.foodOptions.filter(item => item.id.toString() === e.target.value);
            let obj = arr[0].food_options[0].extras;
            setExtrasForOption(obj);
            setCurrentPrice(Number(e.target.getAttribute('price')) * currentCounter);
            setSelectedPrice(Number(e.target.getAttribute('price')));
            document.getElementsByClassName('check-input').forEach((item) => {
                item.checked = false;
            });
            setChoosedSize({ product_name: selectedFood.name, total: Number(e.target.getAttribute('price')) * currentCounter, size_id: Number(e.target.value), size_name: e.target.getAttribute('title'), size_price: Number(e.target.getAttribute('price')), quantity: currentCounter });
        }
        else if (name === 'cat') {
            fetchFoods(e.target.value);
        }
        else {
            let obj = { extra_id: Number(e.target.value), extra_name: e.target.getAttribute('title'), extra_price: Number(e.target.getAttribute('price')) };
            let arr = [];
            if (choosedExtras.length >= 1)
                arr = [{ ...choosedExtras }];
            arr.push(obj);
            setChoosedExtras(arr);
            setCurrentEPrice(Number(e.target.getAttribute('price')) * currentCounter);
            setSelectedEPrice(Number(e.target.getAttribute('price')));
        }
    }

    const handleClose = () => {
        setShow(false);
        setPicker(false);
        setDeliveryType(false);
        setCurrentCounter(1);
        setSelectedEPrice(0);
        setSelectedPrice(0);
        setCurrentEPrice(0);
        setCurrentPrice(0);
        setExtrasForOption([]);
    }

    const handleShow = (food, id) => {
        setShow(true);
        if (food)
            setSelectedFood(food);
        axios.get(`options/get/${id}`).then(res => {
            setOptions(res.data);
            if (res.data.foodOptions) {
                let arr = res.data.foodOptions.filter((item, index) => index === 0);
                if (arr[0]) {
                    setCurrentPrice(arr[0].food_options[0].price * currentCounter);
                    setSelectedPrice(arr[0].food_options[0].price);
                    setChoosedSize({ product_name: food.name, total: Number(arr[0].food_options[0].price), size_id: Number(arr[0].id), size_name: arr[0].name, size_price: Number(arr[0].food_options[0].price), quantity: 1 });
                    if (arr[0].food_options[0].extras.length >= 1) {
                        let obj = arr[0].food_options[0].extras;
                        setExtrasForOption(obj);
                    }
                }
            }
        })
    }

    const handleAgree = (e) => {
        if (e.target.checked) {
            setAgreement(true)
        }
        else {
            setAgreement(false);
        }
    }

    const handleQty = (name) => {
        if (name === 'plus') {
            setCurrentCounter(currentCounter + 1);
            setCurrentPrice(currentPrice + Number(selectedPrice));
            setCurrentEPrice(currentEPrice + Number(selectedEPrice));
            setChoosedSize({ ...choosedSize, quantity: currentCounter + 1 });
        }
        else {
            setCurrentCounter(currentCounter - 1);
            setCurrentPrice(currentPrice - Number(selectedPrice));
            setCurrentEPrice(currentEPrice - Number(selectedEPrice));
            setChoosedSize({ ...choosedSize, quantity: currentCounter - 1 });
        }
    }

    const saveItems = () => {
        let arr = [...currentCart];
        let value = currentPrice + currentEPrice;
        setTotal(total + value);
        arr.push({ ...choosedSize, total: value, extras: [...choosedExtras] });
        setCurrentCounter(1);
        setChoosedExtras([]);
        setChoosedSize([]);
        setCurrentCart(arr);
        setShow(false);
    }

    const changeVal = (id, name) => {
        let val = 0;
        let result = 0;
        let newCart = currentCart.map((item) => {
            if (item.size_id === id) {
                if (name === 'plus') {
                    if (item.extras.length >= 1) {
                        // eslint-disable-next-line
                        item.extras.map((extra) => {
                            val = val + extra.extra_price;
                        })
                        result = (val + item.size_price) * (item.quantity + 1);
                    }
                    else {
                        result = item.size_price * (item.quantity + 1);
                    }
                    return { ...item, quantity: item.quantity + 1, total: result }
                }
                else {
                    if (item.extras.length >= 1) {
                        // eslint-disable-next-line
                        item.extras.map((extra) => {
                            val = val + extra.extra_price;
                        })
                        console.log(val);
                        result = (val + item.size_price) * (item.quantity - 1);
                        console.log(result);
                    }
                    else {
                        result = item.size_price * (item.quantity - 1);
                    }
                    return { ...item, quantity: item.quantity - 1, total: result }
                }
            }
            return item;
        });
        setCurrentCart(newCart);
    }

    const handleCity = (e) => {
        setSelectedCity(e);
    }

    const submit = (e) => {
        e.preventDefault();
        let newData = new FormData();
        let form;
        e.target.forEach((item) => {
            form = Object.assign({}, form, { [item.name]: item.value });
        });
        newData.append('form', form);
        newData.append('order', currentCart);
        console.log(form, currentCart);
        axios.post('order/store', { currentCart, form }).then(response => alert('Please check your email'))
            .catch(err => alert('error'))
    }

    useEffect(() => {
        let extraP = 0;
        let result = currentCart.map((size) => {
            if (size.extras.length >= 1) {
                // eslint-disable-next-line
                size.extras.map((extra) => {
                    extraP = extraP + extra.extra_price;
                });
                return (extraP + size.size_price) * size.quantity;
            }
            return size.size_price * size.quantity;
        });
        let tt = result.reduce((a, b) => a + b, 0);
        setTotal(tt);
    }, [currentCart]);

    const handleDate = (e) => {
        if (e.target.name === 'date') {
            setDate(e.target.value);
        }
        else {
            setTime(e.target.value);
        }
    }

    return (
        <div className='home'>
            <section className="inner-page-hero bg-image" style={{ backgroundImage: 'url("/webImages/original.jpg")' }}></section>
            <div className="container-fluid menuheader">
                <div className="container px-0">
                    <div className="logo-container">
                        <img src={logo} className="logoimage" alt='ss' />
                    </div>
                    <div className="menubar" id="menubarcard">
                        {
                            !checkout ?
                                <>
                                    <i className="fa fa-home" aria-hidden="true"></i>
                                    <span className="rest-address"> {info.name} | </span>
                                    <span className="fa fa-clock-o"></span>
                                    <span className="open-time"> {info.open_time} - {info.close_time}  </span>
                                </>
                                : <span className="rest-address"> checkout </span>
                        }
                    </div>
                </div>
            </div>
            {   !checkout ?
                <div id='plce_div_menu'>
                    <div className='container'>
                        <div className='wrapper row'>
                            <div className={`col-sm-12 col-md-12 ${activeTab === 0 ? 'col-lg-9 col-xl-9' : 'col-lg-12 col-xl-12'} menusection`}>
                                <div className='menu_tab row'>
                                    <span className='menu_tab_button col'>
                                        <span id="tabMenu1" className={`${activeTab === 0 ? 'active-tab' : null}`}
                                            onClick={() => setActiveTab(0)}
                                        >Produkte</span>
                                    </span>
                                    <span className='menu_tab_button col'>
                                        <span id="tabMenu1" className={`${activeTab === 1 ? 'active-tab' : null}`}
                                            onClick={() => setActiveTab(1)}
                                        >Info</span>
                                    </span>
                                    <span className='menu_tab_button col'>
                                        <span id="tabMenu1" className={`${activeTab === 2 ? 'active-tab' : null}`}
                                            onClick={() => setActiveTab(2)}
                                        >Angebote</span>
                                    </span>
                                    <span className='menu_tab_button col'>
                                        <span id="tabMenu1" className={`${activeTab === 3 ? 'active-tab' : null}`}
                                            onClick={() => setActiveTab(3)}
                                        >Vorbestellung</span>
                                    </span>
                                </div>
                                {
                                    activeTab === 0 ?
                                        <div className="row dishsection">
                                            <div className="d-none d-xl-block col-lg-3 tab_left_sidebar align-self-start sticky-top"
                                                style={{ minHeight: "100vh" }}>
                                                <div id="control" className="menucontrol">
                                                    <div id="menuresults">
                                                        {
                                                            cats ? cats.map((cat, index) => {
                                                                return (
                                                                    <li key={index} className={`menu-item-name ${index === 0 ? 'active' : null}`} onClick={() => fetchFoods(cat.id, index)}>
                                                                        <span className="menu-item-text">
                                                                            {cat.name}
                                                                        </span>
                                                                    </li>
                                                                )
                                                            }) : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-9 menusection">
                                                <div className="menu container">
                                                    <div className="center_hdarea hidden-sm-up row item sticky-top">
                                                        <div className="center_dv_header">
                                                            <table width="100%" border="0" cellSpacing="0" cellPadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <select id="listresults" className="sticky_filter" onChange={(e) => handleChange(e, 'cat')}>
                                                                                {
                                                                                    cats ? cats.map((cat, index) => {
                                                                                        return (
                                                                                            <option value={cat.id} data-top="-1" key={index}>
                                                                                                {cat.name}
                                                                                            </option>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div id='dishesresults'>
                                                        <div className='categorylistblock'>
                                                            {
                                                                foods.image_url ?
                                                                    <div className="category-img row" id="c1005">
                                                                        <img src={foods.image_url} style={{ width: "100%", height: "100%" }} alt={foods.description} />
                                                                    </div>
                                                                    : null
                                                            }
                                                            <div id="cd1005" className="categoryblock row business-cat-c">
                                                                <h4 className="food-category">
                                                                    {foods.title}
                                                                </h4>
                                                                <div className="catdescription">
                                                                    {foods.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id="dishlist1005" className="menulist">
                                                            {
                                                                foods.Foods ? foods.Foods.map((food, index) => {
                                                                    return (
                                                                        <div className="item_dv row" onClick={() => handleShow(food, food.id)} key={index}>
                                                                            <span className="col-10 px-1">
                                                                                <h4 className="food-item-name">
                                                                                    {food.name}
                                                                                </h4>
                                                                                <div>
                                                                                    <div className="menu-item item-description">
                                                                                        {food.description}
                                                                                    </div>
                                                                                </div>
                                                                            </span>
                                                                            <div className="col-2 price_dv col text-right">
                                                                                <button onClick={() => handleShow(food, food.id)} className="btn btn-primary btn-item-price business-price-c">
                                                                                    +
                                                                            </button>
                                                                                {food.food_option ? <span className="item-price">{food.food_option.price}€</span> : null}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> :
                                        activeTab === 1 ?
                                            <div className='info_dv row'>
                                                <div className='col-12'>
                                                    <h4 className="heading4">{info.name}</h4>
                                                    <p className="info-address ">{info.address}</p>
                                                </div>
                                                <div className="opentime_dv col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                                    {info.from_day}. - {info.to_day}. {info.open_time} bis {info.close_time} Uhr<br />
                                                    <br />
                                                    <b>Impressum</b><br /><p>{info.owner}<br /><br />
                                                        {info.name}<br /><br />
                                                        {info.address}<br /><br />
                                                        {info.street}<br /><br />
                                                    Telefon: {info.phone}</p><br /><table width="100%" border="0" cellSpacing="0" cellPadding="0" className="open-time-tbl" id="catlogview">
                                                    </table><br />
                                                </div>
                                            </div> :
                                            activeTab === 2 ?
                                                <div>Angebote</div> :
                                                <div>Vorbestellung</div>
                                }
                            </div>
                            {
                                activeTab === 0 ?
                                    <div className='container mobilefix d-lg-block col-lg-3 tab_right_sidebar'>
                                        <div className='sidebar-wrap sticky-top'>
                                            <div className={`cart-wrap collapse d-lg-block ${mobile ? null : 'd-md-none'}`} id="mobilecart">
                                                <div className='sectionheader'>
                                                    <span>Warenkorb</span>
                                                    <div className='deliveryoption'>
                                                        <div id='deliverylocation'>{selectedCity ? selectedCity.label : abholung ? "Abholung" : 'liefrung'}</div>
                                                        <div className='cartback'>
                                                            <span className='fa fa-pencil' onClick={() => setDeliveryType(true)}>
                                                            </span>
                                                            <span onClick={() => setDeliveryType(true)}>
                                                                Ändern
                                                                    </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    currentCart.length >= 1 ?
                                                        <table width="100%" border="0" cellSpacing="0" cellPadding="0" className="price-tbl" id="plc_rgt_in">
                                                            <tbody>
                                                                {
                                                                    currentCart.map((item, index) => {
                                                                        return (
                                                                            <tr id="dish0" key={index}>
                                                                                <td>
                                                                                    <button type="button" onClick={() => changeVal(item.size_id, 'minus')} disabled={item.quantity > 1 ? false : true} className="btn btn-sm btn-outline-info cart-count-btn">-</button>
                                                                                </td>
                                                                                <td>
                                                                                    <button type="button" onClick={() => changeVal(item.size_id, 'plus')} className="btn btn-sm btn-outline-info cart-count-btn">+</button>
                                                                                </td>
                                                                                <td className="dishinnercart">
                                                                                    <span id="count0">{item.quantity}</span>x <span id="name0">{item.product_name}, {item.size_name} </span>
                                                                                    {
                                                                                        item.extras.length >= 1 ?
                                                                                            <ul className="pdct_op">
                                                                                                <h4>Extrazutaten</h4>
                                                                                                {
                                                                                                    item.extras.map((extra, index) => {
                                                                                                        return (
                                                                                                            <li key={index}>{extra.extra_name} +  {extra.extra_price}</li>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </ul> : ''
                                                                                    }
                                                                                </td>
                                                                                <td align="right">
                                                                                    <span id="price0">{item.total}</span>€
                                                                                        </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                        : null
                                                }
                                                <div id="timechange">
                                                    <button className="btn btn-info btn-sm" onClick={() => setPicker(true)}>
                                                        Zeit ändern?
                                                            </button>
                                                </div>
                                                <div className='cart_details mt-3'>
                                                    <div className='price'>
                                                        <b>Gesamt</b>
                                                        <span>{total}€</span>
                                                    </div>
                                                    <div className='date'>
                                                        <span>Vorbestellzeit</span>
                                                        <div className='text-right'>
                                                            <div>{date}</div>
                                                            <div>{time}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    currentCart.length >= 1 ?
                                                        <button type="button" id="orderbutton" className="btn btn-block btn-success" onClick={() => { (date && time && abholung) || (date && time && (liefrung || selectedCity)) ? setCheckout(true) : setPicker(true) }}>Bestellen</button>
                                                        :
                                                        <button disabled className='btn btn-outline-secondary w-100 mt-3'>
                                                            Bitte Produkt wählen
                                                                </button>
                                                }
                                            </div>
                                        </div>
                                    </div> : null
                            }
                            <footer className="d-block d-lg-none footer">
                                <div className="container">
                                    <button onClick={() => setMobile(!mobile)} className="btn btn-success btn-md btn-block" type="button" datatoggle="collapse" datatarget="#mobilecart" aria-expanded="false" aria-controls="MobileCart">
                                        <div id="mobileCart">Warenkorb anzeigen</div>
                                        <div id="mobileCartSum">{total} €</div>
                                    </button>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div> :
                <div id='plce_div_menu'>
                    <div className='container'>
                        <div className='wrapper row'>
                            <div className='checkoutinfos order-2 order-md-1 col-sm-8'>
                                <section className='sectionbody col margin-b-30'>
                                    <div className='sectionheader'>Bestelldetails</div>
                                    <div className='ck-left-sidebar'>
                                        <form onSubmit={(e) => submit(e)}>
                                            <div id="namepart">
                                                <div className="form-group">
                                                    <label htmlFor="example-text-input">Vor- und Nachname *</label>
                                                    <input type="text" required name='full_name' className="form-control" autoComplete="off" />
                                                </div>
                                            </div>
                                            <div id="deliverypart">
                                                <div className="form-group">
                                                    <label htmlFor="example-text-input">Straße &amp; Hausnummer</label>
                                                    <input type="text" name='address' className="form-control" autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="example-text-input">Postleizahl</label>
                                                    <input type="text" name='post_code' className="form-control" autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="example-text-input">Stadt *</label>
                                                    {
                                                        abholung ? <input type="text" name='city' disabled value='Abholung' className="form-control" autoComplete="off" /> :

                                                            <Select
                                                                name='city'
                                                                value={selectedCity}
                                                                defaultValue={selectedCity}
                                                                onChange={(e) => handleCity(e)}
                                                                options={address}
                                                            />
                                                    }
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="example-text-input">Besondere Hinweise (optional)</label>
                                                    <input type="text" className="form-control" name='instruction' autoComplete="off" placeholder="z.B. Erster Innenhof, 4. Etage rechts..." />
                                                </div>
                                            </div>
                                            <div>
                                                <div id="telpart">
                                                    <div className="form-group">
                                                        <label htmlFor="example-text-input">Telefon *</label>
                                                        <input type="tel" required name='phone' className="form-control" autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="example-text-input">E-Mail *</label>
                                                    <input type="email" required name='email' className="form-control" autoComplete="off" aria-describedby="emailHelp" />
                                                </div>
                                                <div id="infopart">
                                                    <div className="form-group">
                                                        <label htmlFor="example-text-input">Kommentar</label>
                                                        <input type="text" name='comment' className="form-control" autoComplete="off" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="example-text-input">Abholzeit</label>
                                                        <input type="text" name='date' disabled value={`${date} ${time}`} className="form-control" autoComplete="off" />
                                                    </div>
                                                    <div className="text-center py-3 text-center">
                                                        <label className="checkbox-inline">
                                                            <input type="checkbox" name='agree' onChange={(e) => handleAgree(e)} />
                                                                Ich stimme den
                                                                <span>AGB</span>
                                                                und den
                                                                <span>Datenschutzbestimmungen</span>
                                                                zu
                                                            </label>
                                                    </div>
                                                    <div className='text-center'>
                                                        <button type='submit' disabled={agreement ? false : true} className='btn btn-success btn-lg'>
                                                            Jetzt Bestellen
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </section>
                            </div>
                            <div className='checkoutinfos order-1 order-md-2 col-sm-4'>
                                <div className='sectionbody col margin-b-30'>
                                    <div className='sectionheader'>
                                        Bestellübersicht
                                    <div className="cartback float-right" onClick={() => setCheckout(false)}>
                                            <span className="fa fa-pencil"></span>
                                            <span> Zurück</span>
                                        </div>
                                    </div>
                                    <div className='checkout-rightcheckout'>
                                        <div className='checkout-restaurant-name'>
                                            <span className='caption nonselectable default'>
                                                {info.name}
                                            </span>
                                        </div>
                                        <div className='cartresultsinner'>
                                            <table className='table'>
                                                <tbody>
                                                    {
                                                        currentCart.map((item, index) => {
                                                            return (
                                                                <tr className='dishrow' key={index}>
                                                                    <td align='left'>
                                                                        <span className='food-name'>{item.quantity}</span>x <span id="name0">{item.product_name}, {item.size_name} </span>
                                                                        {
                                                                            item.extras.length >= 1 ?
                                                                                <ul className="pdct_op">
                                                                                    <h4>Extrazutaten</h4>
                                                                                    {
                                                                                        item.extras.map((extra, index) => {
                                                                                            return (
                                                                                                <li key={index}>{extra.extra_name} +  {extra.extra_price}</li>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </ul> : ''
                                                                        }
                                                                    </td>
                                                                    <td align="right" valign="top" className="ch_rate" >
                                                                        <span id="price0">{item.total}</span>€
                                                                </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='cartsum d-flex justify-content-between'>
                                            <span>Summe</span>
                                            <span>{total}€</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            }
            { mobile ? <div id='mbcartgrey' onClick={() => setMobile(false)}></div> : null}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{normal ? 'Bitte Auswahl treffen' : abholung ? 'Optionen' : 'Wohin soll geliefert werden?'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`d-flex justify-content-around ${step !== 0 ? 'flex-column px-0 py-0' : null}`}>
                    {
                        step === 0 ?
                            <>
                                <Button variant="success" onClick={() => { setStep(1); setNormal(false); setAbholung(true); setSelectedCity(null); setLiefrung(false); }}>ABHOLUNG</Button>
                                <Button variant="success" onClick={() => { setStep(2); setNormal(false); setLiefrung(true); setSelectedCity(null); setAbholung(false); }}>LIEFERUNG</Button>
                            </> :
                            step === 1 ? selectedFood ?
                                <>
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <div className='text-center'>
                                                    <b>{selectedFood.name}</b>
                                                    <p>{selectedFood.description}</p>
                                                </div>
                                            </div>
                                            <div className='col-12'>
                                                <Accordion preExpanded={['a']}>
                                                    <AccordionItem uuid="a">
                                                        <AccordionItemHeading>
                                                            <AccordionItemButton>
                                                                Größe
                                                                </AccordionItemButton>
                                                        </AccordionItemHeading>
                                                        <AccordionItemPanel>
                                                            {
                                                                options.foodOptions ? options.foodOptions.map((option, index) => {
                                                                    return (
                                                                        <div className="form-check" key={index}>
                                                                            <input className="form-check-input" type="radio" name="size" title={option.name} defaultChecked={index === 0 ? true : false} onChange={(e) => handleChange(e, 'size')} price={option.food_options[0].price} value={option.id} />
                                                                            <label className="form-check-label" htmlFor="size">
                                                                                {option.name}
                                                                            </label>
                                                                            <span className='price'>{option.food_options[0].price}€</span>
                                                                        </div>
                                                                    )
                                                                }) : null
                                                            }
                                                        </AccordionItemPanel>
                                                    </AccordionItem>
                                                    <AccordionItem uuid="b">
                                                        <AccordionItemHeading>
                                                            <AccordionItemButton>
                                                                Extrazutaten<br /><span className='text-secondary'>Optional</span>
                                                            </AccordionItemButton>
                                                        </AccordionItemHeading>
                                                        <AccordionItemPanel>
                                                            {
                                                                extrasForOption.length >= 1 ? extrasForOption.map((extra, index) => {
                                                                    return (
                                                                        <div className="form-check" key={index}>
                                                                            <input className="form-check-input check-input" type="checkbox" name="extra" title={extra.name} defaultChecked={false} id={extra.id} onChange={(e) => handleChange(e, 'extra')} price={extra.price} value={extra.id} />
                                                                            <label className="form-check-label" htmlFor="extra">
                                                                                {extra.name}
                                                                            </label>
                                                                            <span className='price'>{extra.price}€</span>
                                                                        </div>
                                                                    )
                                                                }) : null
                                                            }
                                                        </AccordionItemPanel>
                                                    </AccordionItem>
                                                </Accordion>
                                                <input type="text" className="form-control mt-3 mb-3" name='comment' placeholder="Kommentar (z.B. kein Salz)" />
                                                <div className='d-flex justify-content-center align-items-center'>
                                                    <button className='btn btn-sm btn-outline-info extracount' disabled={currentCounter === 1 ? true : false} onClick={() => handleQty('minus')}>-</button>
                                                    <span className='quantity'>{currentCounter}</span>
                                                    <button className='btn btn-sm btn-outline-info extracount' onClick={() => handleQty('plus')}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button className='btn btn-success mt-2 w-100 addCart' onClick={() => saveItems()}>
                                            In den Warenkorb <span>{currentPrice + currentEPrice}€</span>
                                        </button>
                                    </div>
                                </> : null :
                                step === 2 ?
                                    <>
                                        <div className='container'>
                                            <div className='row'>
                                                <div className='col-12 my-3'>
                                                    <Select
                                                        value={selectedCity}
                                                        onChange={(e) => handleCity(e)}
                                                        options={address}
                                                    />
                                                </div>
                                                <div className='col-12 my-3 text-center'>
                                                    <Button variant="success" disabled={selectedCity ? false : true} onClick={() => { setLiefrung(true); setStep(1); }}>Fortsetzen</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </> : null
                    }

                </Modal.Body>
            </Modal>
            <Modal show={deliveryType} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Bitte Auswahl treffen</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex justify-content-around'>
                    <Button variant="success" onClick={() => { setNormal(false); setStep(1); setSelectedCity(null); setLiefrung(false); setDeliveryType(false); setAbholung(true); }}>ABHOLUNG</Button>
                    <Button variant="success" onClick={() => { setNormal(false); setStep(2); setLiefrung(true); setAbholung(false); setSelectedCity(null); setDeliveryType(false); }}>LIEFERUNG</Button>
                </Modal.Body>
            </Modal>
            <Modal show={picker} onHide={() => console.log('error')} className='modalFirst'>
                <Modal.Header>
                    <Modal.Title>Vorbestellung</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex flex-column justify-content-center'>
                    <div className='text-center text-danger'>
                        {error ? 'please select time and date' : null}
                    </div>
                    <div className="mb-3 d-flex flex-column">
                        <label className="form-label">Datum für Ihre Vorbestellung</label>
                        <input name='date' defaultValue={date} onChange={(e) => handleDate(e)} type='date' />
                    </div>
                    <div className="mb-3 d-flex flex-column">
                        <label className="form-label">Zeit für Ihre Vorbestellung</label>
                        <input name='time' defaultValue={time} onChange={(e) => handleDate(e)} type='time' />
                    </div>
                    <Button variant="success" disabled={date && time ? false : true} onClick={() => { setPicker(false); setError(false); }}>
                        Weiter
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Home
