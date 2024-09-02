import { React, useEffect, useState } from "react";
import './Register.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {

    useEffect(() => {  //sayfa başlarken backgroundu black yapıyoruz
        document.body.style.backgroundColor = 'black';
        return () => {
            document.body.style.backgroundColor = '';
        }
    }, [])
    const navigate = useNavigate(); //Navigation hookunu kullanıyoruz

    const goToLogin = () => { //Login sayfasına geçiş
        navigate('/login');
    }

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSave = (e) => {
        e.preventDefault(); // Sayfanın yenilenmesini engeller.
        const url = 'https://localhost:7107/api/Users/Registration';
        const data = {
            "firstname": firstName,
            "lastname": lastName,
            "email": email,
            "password": password
        }
        axios.post(url, data)
            .then(() => {
                clear();
                toast.success("Kullanıcı Başarıyla Eklendi")
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data);
                }
                else {
                    toast.error("Bir hata oluştu :" + error.message)
                }

            })
    }
    const clear = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
    }
    return (
        <div className="addUser">
            <ToastContainer />
            <h3>Kayıt Ol</h3>
            <form className="addUserForm">
                <div className="inputGroup">
                    <label htmlFor="name">Ad:</label>
                    <input
                        type="text"
                        id="firstName"
                        autoComplete="off"
                        placeholder="Adınızı giriniz"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label htmlFor="name">Soyad:</label>
                    <input
                        type="text"
                        id="lastName"
                        autoComplete="off"
                        placeholder="Soyadınızı giriniz"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        autoComplete="off"
                        placeholder="Mailinizi giriniz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="name">Şifre:</label>
                    <input
                        type="password"
                        id="password"
                        autoComplete="off"
                        placeholder="Şifrenizi giriniz"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" class="btn btn-success" onClick={handleSave}>Kayıt Ol</button>
                </div>

            </form>
            <div className="login">
                <p>Zaten bir hesabınız var mı?</p>
                <button type="submit" class="btn btn-primary" onClick={goToLogin}>Giriş Yap</button>
            </div>


        </div>
    )

}
export default Register;

/*
useEffect(() => {
        document.body.style.backgroundColor = 'black';
        return () => {
            document.body.style.backgroundColor = '';
        }
    }, [])
*/