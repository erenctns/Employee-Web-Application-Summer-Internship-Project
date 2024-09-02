import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import DarkMode from "./DarkMode/DarkMode";
import FooterPart from "./Footer/Footer";
import { useTranslation } from "react-i18next";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";


//TÜM CRUD İŞLEMLERİ BURADA YAPILACAK
const CRUD = () => {
    const navigate = useNavigate(); //Navigation hookunu kullanıyoruz

    const { t, i18n } = useTranslation() // DİL DESTEĞİ İÇİN


    //alttaki 3 state bootstrapten geldi(modal bootstrapinden)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //üsttekiler bootstrapten geldi (modal bootstrapinden)

    //Yeni bir öğe eklemek istediğinizde,kullanıcının girdiği verileri saklamak için bu stateleri kullanırız.
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [isActive, setIsActive] = useState(0)

    //ŞİMDİLİK SEARCH İÇİN EKLİYORUZ******************************************
    const [searchName, setSearchName] = useState('')

    // Bir öğeyi düzenlemek istediğinizde, düzenlenecek öğenin mevcut değerlerini bu durumlara yükler ve kullanıcının yaptığı değişiklikleri bu durumlarda saklarsınız.
    const [editID, setEditId] = useState('')
    const [editName, setEditName] = useState('')
    const [editAge, setEditAge] = useState('')
    const [editIsActive, setEditIsActive] = useState(0)


    //ŞİMDİLİK SEARCH İÇİN EKLİYORUZ******************************************
    const [editSearchName, setEditSearchName] = useState('')



    const [data, setData] = useState([]); //data kısmı api responselerini tutucak ve değiştirmek istersek setData() fonkunu kullanıcaz.

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
        else {
            //tokeni alıp kullandığımız yer.
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            //sayfa yüklediği zaman localstorageden dili alıyor
            const savedLanguage = localStorage.getItem('language') || 'tr'; //varsayılan olarak tr verdik
            i18n.changeLanguage(savedLanguage);
            getData(); //sayfa yenilendiğinde ilk olarak burası çalışır yani empdata arrayı ekrana yazdırılır,burda normalde setData(empdata) yı çağırıyoduk yukarı manuel olarak yazarak, şimdi apiden çağırdığımız objeleri vericez.
        }
    }, [])

    //*******************SEARCH İÇİN KENDİM EKLEDİM ************************
    useEffect(() => {
        const handler = setTimeout(() => {
            handleSearch();
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchName]);


    //Bu kısımda API den gelen CRUD işlemleri için

    //ekrana API yardımı ile DB deki verileri yazdıran kısım,GET() kısmı,sonradan eklenen handleSearch() fonksiyonu ile uyumlu.
    const getData = () => {
        let url = `https://localhost:7107/api/Employee/search?name=${encodeURIComponent(searchName)}`;
        axios.get(url)
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
        /*
        axios.get('https://localhost:7107/api/Employee')
        .then((result) => {
            setData(result.data)
        })
        .catch((error) => {
            console.log(error)
        })
         */
    }

    const handleEdit = (id) => {  // edit butonu için işlemler id ye göre get kullanımı Get({id}),
        // alert(id)
        handleShow(); // edite basınca bu bootstrapten gelen fonksiyon sayesinde model pop up açılacak.

        //burası güncelleyeceğimiz verinin name age isActive kısmında yazan bilgileri ekrana verir.
        axios.get(`https://localhost:7107/api/Employee/${id}`)
            .then((result) => {
                setEditName(result.data.name);
                setEditAge(result.data.age);
                setEditIsActive(result.data.isActive);
                setEditId(id);
            })
    }
    const handleDelete = (id) => {  // delete butonu için işlemler,silme ekranı açılışı ve API isteğine göre silme
        if (window.confirm(t('deleteMessage')) == true) {
            axios.delete(`https://localhost:7107/api/Employee/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success(t('deleteMessagePopUp'));
                        getData(); //Sildikten sonra yeni hali ekrana yazdırması için tekrardan getData() çağırıyoruz.
                    }
                })
                .catch((error) => {
                    toast.error(error);
                })
        }

    }
    //edit kısmına tıkladığında açılan pop-up içindeki değişiklikleri save eden kısım
    const handleUpdate = () => {
        const url = `https://localhost:7107/api/Employee/${editID}`;
        const data = {
            "id": editID,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }
        axios.put(url, data)
            .then((result) => {
                handleClose(); // işlem onaylandıktan sonra pop-up'ı kapatmaya yarar.
                getData();    //Ekledikten sonra ekrana yeni veri ile birlikte bütün listeyi tekrar bas
                clear(); //işlem başarılı olursa doldurulan alanları temizler
                toast.success(t('updateMessagePopUp'));//değişiklik yaptıktan sonra ekrana çıkan toast message  box
            })
            .catch((error) => {
                toast.error(error);
            })
    }
    //name age ve isActive kısmını girip submite bastığımızda API yardımıyla db ye objeyi kayıt işlemi
    const handleSave = () => {
        const url = 'https://localhost:7107/api/Employee';
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }
        axios.post(url, data)
            .then((result) => {
                getData();    //Ekledikten sonra ekrana yeni veri ile birlikte bütün listeyi tekrar bas
                clear(); //işlem başarılı olursa doldurulan alanları temizler
                toast.success(t('addedMessagePopUp'));//ekleme yaptıktan sonra sağda ekrana çıkan toast message  box
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data)
                }
                else {
                    toast.error("Bir hata oluştu" + error.message)
                }
            })
    }
    //bu kısım eklemeler vesayre yapıldıktan sonra hepsini sıfırlıyor, temizliyor
    const clear = () => {
        setName('');
        setAge('');
        setIsActive(0);
        setEditName('');
        setEditAge('');
        setEditIsActive(0);
        setEditId('');
    }
    //isActive seçimi için, 
    const handleActiveChange = (e) => {
        if (e.target.checked) {
            setIsActive(1);
        }
        else {
            setIsActive(0);
        }
    }
    //burası da edit kısmında isActive seçimi için , 
    const handleEditActiveChange = (e) => {

        if (e.target.checked) {
            setEditIsActive(1);
        }
        else {
            setEditIsActive(0);
        }

    }
    const handleSearch = (() => { //BU KISMI SEARCH İÇİN BEN EKLEDİM.
        getData();
    })

    //dili değiştirirken localstorageye kaydetme işlemi
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    }
    const handleLogOut = () => {
        if (window.confirm(t('logOutMessage')) == true) {
            sessionStorage.removeItem('token')//hem tokeni sil hem de user'ı sil.
            sessionStorage.removeItem('user')
            toast.error(t('quit'))
            setTimeout(() => {
                navigate('/')
            }, 2000)
        }

    }

    return (
        <Fragment >
            {/*"Navbar Kısmı" */}
            <Navbar bg="dark" data-bs-theme="dark" sticky="top" className="me-3">
                <Container>
                    <Navbar.Brand href="#home" >{t('employeeList')}</Navbar.Brand>
                    <Nav className="me-auto me-3">
                        <Nav.Link href="/crud" className="me-3">{t('employeeList')}</Nav.Link>
                        <Nav.Link href="/users" className="me-3">{t('userList')}</Nav.Link>
                        <button className="btn btn-dark me-3"
                            type="button"
                            onClick={() => changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}>
                            {t('changeLanguageText')}
                        </button>
                        <button className="btn btn-dark me-3"
                            type="button"
                            onClick={handleLogOut}>
                            {t('logOut')}
                        </button>
                        <DarkMode />
                    </Nav>
                </Container>
            </Navbar>
            <ToastContainer />
            <Container> {/*Burası en yukardaki satır için ve light dark mode kısmı için switch vereceğimiz yer*/}
                <Row className="pt-3">
                    <Col xs={6} md={3} className="p-1">
                        <input type="text" className="form-control" placeholder={t('namePlaceHolder')}
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </Col>
                    <Col xs={6} md={3} className="p-1">
                        <input type="text" className="form-control" placeholder={t('agePlaceHolder')} value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </Col>
                    <Col xs={6} md={3} className="p-1">
                        <input type="checkbox"
                            checked={isActive === 1 ? true : false}
                            value={isActive}
                            onChange={(e) => handleActiveChange(e)} //burayı bir tık anlamadım
                        />
                        <label style={{ marginLeft: '10px' }}>{t('isActivePlaceHolder')}</label>
                    </Col>
                    <Col xs={6} md={3} className="p-1">
                        <button className="btn btn-primary" onClick={() => handleSave()}>{t('submit')}</button>
                    </Col>

                </Row>
                <Row className="mt-3"> {/*ARAMA ÇUBUĞU İÇİN*/}
                    <Col xs={12} md={12} className="p-1">
                        <input
                            type="search"
                            className="form-control"
                            placeholder={t('searchPlaceHolder')}
                            value={searchName}
                            onChange={(e) => {
                                setSearchName(e.target.value);
                                handleSearch(); // Her değişiklikte arama yap
                            }}
                        />
                    </Col>
                </Row>
            </Container>
            <br></br>
            <Table striped bordered hover>{/*Burası ortadaki tablomuz için*/}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('fullName')}</th>
                        <th>{t('age')}</th>
                        <th>{t('isItActive')}</th>
                        <th>{t('options')}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        /*Burada koşul oluşturduk, data ve datanın uzunluğu 0 dan büyükse ekranda tablo olarak listele, eğer yoksa da Loading... yazdır ve index+1 datası ekledik, teker teker artıracak,handleEdit,handleDelete
                        fonksiyonları oluşturduk ve basıldığında çıkmasını istediğimiz şeyleri yaptırdık*/
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>{/*Arayüzdeki employeeleri birer artırmak için*/}
                                        <td>{item.name}</td>
                                        <td>{item.age}</td>
                                        <td>{item.isActive}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>{t('edit')}</button> &nbsp;
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>{t('delete')}</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td colSpan="5">{t('loading')}</td>
                            </tr>
                    }
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>{/*Burası Edit'e tıklayınca açılan pop-up için*/}
                <Modal.Header closeButton>
                    <Modal.Title>{t('editPopUpHeader')}</Modal.Title>
                </Modal.Header>
                <Modal.Body> {/*En yukarıdaki satırı yaptığım Container'daki ROW u buraya da yapıştırdım editlerken de aynısı oluyor çünkü*/}
                    <Row>
                        <Col>
                            <input type="text" className="form-control" placeholder={t('fullName')}
                                value={editName} onChange={(e) => setEditName(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input type="text" className="form-control" placeholderplaceholder={t('age')} value={editAge}
                                onChange={(e) => setEditAge(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input type="checkbox"
                                checked={editIsActive === 1 ? true : false}
                                value={editIsActive}
                                onChange={(e) => handleEditActiveChange(e)}
                            />

                            <label>{t('isItActive')}</label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('close')}
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        {t('saveChanges')}
                    </Button>
                </Modal.Footer>
            </Modal>
            <FooterPart />
        </Fragment>

    )
}
export default CRUD

/*
DarkMode kısmını Navbar kısmına taşıdık
 <Col xs={6} md={2} className="p-1">
                        <DarkMode />
                    </Col>   
*/

/*
Change Language kısmını en yukarıdaki navbara taşıdık

<Col xs={6} md={2} className="p-1">
                        <button className="btn btn-danger"
                            type="button"
                            onClick={() => changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}>
                            {t('changeLanguageText')}
                        </button>
                    </Col>
*/