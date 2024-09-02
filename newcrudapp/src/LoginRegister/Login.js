import { React, useEffect, useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const Login = () => {

    useEffect(() => {
        document.body.style.backgroundColor = 'black';
        return () => {
            document.body.style.backgroundColor = '';
        }
    }, [])

    const navigate = useNavigate(); //Navigation hookunu kullanıyoruz

    const goToRegister = () => {
        navigate('/');
    }
    const goToPassword = () => {
        navigate('/password')
    }


    const handleSave = (e) => {
        e.preventDefault();
        const url = 'https://localhost:7107/api/Users/Login';

        const data = {
            "email": email,
            "password": password,
        }
        axios.post(url, data)
            .then((result) => {
                if (result.status === 200) {
                    //Login olan kullanıcıya burada token veriyoruz.
                    const token = result.data.token;
                    const userLogged = result.data.user; //Giren kullanıcıyı alıyorum
                    sessionStorage.setItem('token', token);
                    // Giren kullanıcıyı sessionStorageye ekliyorum, bu bir obje olduğu için onu stringe çeviriyorum.
                    sessionStorage.setItem('user', JSON.stringify(userLogged))
                    setTimeout(() => {
                        navigate('/CRUD')
                    }, 3000)
                    toast.success("Giriş Başarılı");
                }
                else {

                }
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

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    return (
        <div className="addUser">
            <ToastContainer />
            <h3>Giriş Yap</h3>
            <form className="addUserForm">
                <div className="inputGroup">
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
                    <button type="submit" class="btn btn-primary" onClick={handleSave}>Giriş Yap</button>
                </div>
            </form>
            <div className="login">
                <p>Hesabınız yok mu?</p>
                <button type="submit" class="btn btn-success" onClick={goToRegister}>Kayıt Ol</button>
            </div>
            <div className="login">
                <p>Şifre Güncelle</p>
                <button type="submit" class="btn btn-success" onClick={goToPassword}>Şifre Güncelle</button>
            </div>
        </div>
    )

}
export default Login;

/*
useEffect(() => {
        document.body.style.backgroundColor = 'black';
        return () => {
            document.body.style.backgroundColor = '';
        }
    }, [])
*/