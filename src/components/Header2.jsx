import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../pages/ReservationPage.css";

export default function Header2() {
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Logout API call failed:", err);
        } finally {
            logout(); // context와 localStorage에서 사용자 정보/토큰 제거
            navigate('/'); // 홈페이지로 이동
        }
    };

    return (
        <div className="Header">
            <Link to='/reservation' className="Logo">
                reservation
            </Link>
            <div className="logged_button">
                <Link to='/MyReserve' className="myReseve">
                    나의 예약
                </Link>
                <button onClick={handleLogout} className="logout">
                    로그아웃
                </button>
            </div>
        </div>
    );
}