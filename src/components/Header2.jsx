import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../pages/ReservationPage.css";

export default function Header2() {
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 백엔드 실행 경로에 따라 변경
            const res = await fetch('http://localhost:5001/api/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await res.json();

            if(res.ok) {
                alert(data.message);
            }
            else{
                alert("로그아웃 실패: " + data.message);
            }
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