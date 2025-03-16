import React, { useState, useContext } from 'react';
import { SignIn } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin() {
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminError, setAdminError] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3000/admin-api/login', {
                email: adminEmail,
                password: adminPassword,
            });
            if (res.data.message === 'success') {
                localStorage.setItem('admin', JSON.stringify(res.data.payload));
                navigate('/admin-dashboard');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setAdminError(err.response.data.message);
            } else {
                setAdminError('An error occurred during login.');
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <div>
                <h2>Admin Sign In</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                />
                <button classname='btn btn-danger'onClick={handleAdminLogin}>For ADMIN login</button>
                {adminError && <p className="text-danger">{adminError}</p>}
                <hr/>
                <h2>For User/Author LogIn</h2>
                <SignIn />
            </div>
        </div>
    );
}

export default Signin;