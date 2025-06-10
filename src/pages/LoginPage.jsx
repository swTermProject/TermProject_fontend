import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // useAuth 훅 임포트
import Header1 from "../components/Header1";
// ... (기존 아이콘 import)
import './LoginPage.css';

export default function LogInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth(); // AuthContext의 login 함수 사용
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // 에러 메시지 초기화

        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // 로그인 성공 시, context에 사용자 정보와 토큰 저장
                login(data.user, data.token);
                // 예약 페이지로 이동
                navigate('/reservation');
            } else {
                setError(data.message); // 실패 메시지 표시
            }
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
            console.log(err);
        }
    };

    // ... (기존 return JSX 부분은 유지하되, form과 input을 수정)
    return (
        <div>
            <Header1 />
            <div className="Login_form" onSubmit={handleLogin}>
                <form className="login">
                    {/* <div className="form__header">
                        계정이 없으신가요?
                        <Link to="/signup"> 회원가입</Link>
                    </div> */}
                    <h2 className="form__title">로그인</h2>
                    <p className="form__subtitle">Reservation에 오신 것을 환영합니다!</p>
                    {/* Email Input */}
                    <label className="form__label email-input-wrapper">
                        Email
                        <input
                          type="email"
                          placeholder="이메일을 입력하세요"
                          className="form__input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        {/* ... icon */}
                    </label>

                    {/* Password Input */}
                    <label className="form__label password-input-wrapper">
                        Password
                        <div className="form__password-wrapper">
                          <input
                            type= 'password'
                            placeholder="비밀번호를 입력하세요"
                            className="form__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          {/* ... icon and toggle button */}
                        </div>
                    </label>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    <button type="submit" className="form__submit">Login</button>
                </form>
                {/* ... */}
            </div>
        </div>
    );
}