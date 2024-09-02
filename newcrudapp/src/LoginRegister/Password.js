
import { React, useEffect, useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";


const Password = () => {
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {  //sayfa başlarken backgroundu black yapıyoruz
        document.body.style.backgroundColor = 'black';
        return () => {
            document.body.style.backgroundColor = '';
        }
    }, [])
    const navigate = useNavigate(); //Navigation hookunu kullanıyoruz

    const goToLogin = () => {
        navigate('/login');
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        const url = 'https://localhost:7107/api/Users/UpdatePassword';
        const data = {
            "email": email,
            "currentPassword": currentPassword,
            "newPassword": newPassword
        }
        axios.put(url, data)
            .then((result) => {
                if (result.status === 200) {
                    setTimeout(() => {
                        navigate('/login')
                    }, 3000)
                    toast.success("Şifreniz Başarıyla Güncellendi")
                    clear();
                }
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data)
                }
                else {
                    toast.error("Bir hata oluştu :" + error.message)
                }

            })
    }
    const clear = () => {
        setEmail("");
        setCurrentPassword("");
        setNewPassword("");
    }

    return (
        <div className="addUser">
            <ToastContainer />
            <h3>Şifre Güncelle</h3>
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
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <label htmlFor="name">Yeni Şifre:</label>
                    <input
                        type="password"
                        id="passwordNew"
                        autoComplete="off"
                        placeholder="Yeni şifrenizi giriniz"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button type="submit" class="btn btn-primary" onClick={handleUpdate} >Güncelle</button>
                </div>
            </form>
            <div className="login">
                <button type="submit" class="btn btn-success" onClick={goToLogin} >Giriş Sayfasına Dön</button>
            </div>
        </div>
    )

}
export default Password;