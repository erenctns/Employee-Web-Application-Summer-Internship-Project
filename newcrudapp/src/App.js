import './App.css';
import CRUD from './CRUD';
import React from 'react';
import './index.js';
import { Routes, Route } from 'react-router-dom';
import Login from './LoginRegister/Login.js';
import Register from './LoginRegister/Register.js';
import NotFoundPage from './LoginRegister/NotFoundPage.js';
import Users from './Users.js';
import Password from './LoginRegister/Password.js';

//Routes ile sayfalar arası geçiş yaptık kök root olarak Login sayfasını verdik.
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/Login' element={<Login />} />
        <Route path="/Crud" element={
          <div className="App">
            <CRUD />
          </div>
        }
        />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/Users' element={<Users />}></Route>
        <Route path='/Password' element={<Password/>}></Route>
      </Routes>
    </div>

  );
}

export default App;
