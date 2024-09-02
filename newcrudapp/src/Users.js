import { Fragment, React, useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import FooterPart from "./Footer/Footer";
import DarkMode from "./DarkMode/DarkMode";
import { useTranslation } from "react-i18next";
import './Users.css';
import { useNavigate } from "react-router-dom";



const Users = () => {



    const navigate = useNavigate(); //Navigation hookunu kullanıyoruz
    //aslında linkler içinde navigate mevcut fakat token gelmemesi durumunda yönlendirme yapmak için bunu kullanıyoruz

    const { t, i18n } = useTranslation() // DİL DESTEĞİ İÇİN

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        const userLogged = JSON.parse(sessionStorage.getItem('user')) // Burda sessionStorageden string olarak aldığımız giriş yapan kullanıcıyı object olarak geri alıyoruz.
        setUserLogged(userLogged); //UserLogged ' u state'e verdik.
        if (!token) {
            navigate('/CRUD')
        }
        else {
            //Yetkilendirme gereken istekler için 'Authorization' başlığı ile beraber gönderilmesini sağlar.
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            //sayfa yüklediği zaman localstorageden dili alıyor
            const savedLanguage = localStorage.getItem('language') || 'tr'; //varsayılan olarak tr verdik
            i18n.changeLanguage(savedLanguage);
            getData();
        }

    }, [])
    //dili değiştirirken localstorageye kaydetme işlemi
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    }


    const getData = () => {
        let url = 'https://localhost:7107/api/Users/GetUsers';
        axios.get(url)
            .then((result) => {
                setData(result.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //Userların listelendiği users sayfasındaki delete işlemi kısmı
    const handleDelete = (id) => {
        if (window.confirm(t('deleteMessage')) == true) {
            if (userLogged && userLogged.userId == id) //aslında userLogged'ın boş olma ihtimali yok içeri girer girmez atama yapıyoruz ama yine de yazdık belli olmaz.
            {
                if (window.confirm(t('deleteOurself')) == true) {
                    axios.delete(`https://localhost:7107/api/Users/${id}`)
                        .then((result) => {
                            if (result.status === 200) {
                                toast.success(t('deleteMessagePopUp'))
                                setTimeout(() => {
                                    handleLogOutDelete();
                                })
                            }
                        })
                }
            }
            else {
                axios.delete(`https://localhost:7107/api/Users/${id}`)
                    .then((result) => {
                        if (result.status === 200) {
                            toast.success(t('deleteMessagePopUp'))
                            getData();
                        }
                    })
                    .catch((error) => {
                        toast.error(error);
                    })

            }

        }
    }

    useEffect(() => {
        getData();
    }, [])

    const [data, setData] = useState([]);
    const [userLogged, setUserLogged] = useState(null); //Login yapan kullanıcıyı almak için yaptık


    //Logout dediğimizde tokeni sessionStorageden siler ve oturum sonlandırıldığı için login sayfasına geri döner
    const handleLogOut = () => {
        if (window.confirm(t('logOutMessage'))) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            toast.error(t('quit'))
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }

    }
    const handleLogOutDelete = () => { //Sil dediğimizde logout olması için
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user')
        toast.error(t('quit'));
        setTimeout(() => {
            navigate('/')
        }, 3000)
    }


    return (
        <Fragment>
            {/*"Navbar Kısmı" */}
            <Navbar bg="dark" data-bs-theme="dark" sticky="top" className="me-3">
                <Container>
                    <Navbar.Brand href="#home" >{t('userList')}</Navbar.Brand>
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
            <div className="usertable">
                <Table striped bordered hover >{/*Burası ortadaki tablomuz için*/}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('userId')}</th>
                            <th>{t('firstName')}</th>
                            <th>{t('lastName')}</th>
                            <th>{t('email')}</th>
                            <th>{t('password')}</th>
                            <th>{t('isActive')}</th>
                            <th>{t('createdOn')}</th>
                            <th>{t('delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            /*Burada koşul oluşturduk, data ve datanın uzunluğu 0 dan büyükse ekranda tablo olarak listele, eğer yoksa da Loading... yazdır ve index+1 datası ekledik, teker teker artıracak.*/
                            data && data.length > 0 ?
                                data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>{/*Arayüzdeki userları birer artırmak için*/}
                                            <td>{item.userId}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.email}</td>
                                            <td>{item.password}</td>
                                            <td>{item.isActive}</td>
                                            <td>{item.createdOn}</td>
                                            <td>
                                                <button className="btn btn-danger" onClick={() => handleDelete(item.userId)}>{t('delete')}</button>
                                            </td>
                                        </tr>

                                    )
                                })
                                :
                                <tr>
                                    <td colSpan="8">{t('loading')}</td>
                                </tr>
                        }

                    </tbody>
                </Table>
            </div>
            <FooterPart />
        </Fragment>
    )
}

export default Users;