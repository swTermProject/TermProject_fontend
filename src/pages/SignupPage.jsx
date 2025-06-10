import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // 로그인 페이지 CSS 재사용
import Header1 from "../components/Header1";


export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });
            const data = await response.json();

            if (data.success) {
                alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
                navigate('/login');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('회원가입 중 오류가 발생했습니다.');
            console.log(err);
        }
    };

    return (
        <div>
            <Header1 />
            <div className="Login_form">
                {/* <div className="form__header">
                    이미 계정이 있으신가요? 
                    <Link to="/login"> 로그인</Link>
                </div> */}
                <h2 className="form__title">회원가입</h2>
                <p className="form__subtitle">Reservation에 오신 것을 환영합니다!</p>
                <form onSubmit={handleSignup}>
                    <label className="form__label">
                        Email
                        <input 
                            type="email" 
                            placeholder='이메일을 입력하세요'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="form__input" />
                    </label>
                    <label className="form__label">
                        Username
                        <input 
                            type="text" 
                            placeholder='이름을 입력하세요'
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            className="form__input" />
                    </label>
                    <label className="form__label">
                        Password
                        <input 
                            type="password" 
                            placeholder='비밀번호를 입력하세요'
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="form__input" />
                    </label>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" className="form__submit">회원가입</button>
                </form>
            </div>
        </div>
    );
}