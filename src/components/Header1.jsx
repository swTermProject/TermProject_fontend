import "../pages/HomePage.css";
import { Link } from 'react-router-dom';

export default function Header1() {
    return(
        <div className="Header">
            <Link to='/' className="UnLogo">
                reservation
            </Link>
            <div className="login_button">
                <Link to='/login' className="login">
                    로그인
                </Link>
                <Link to='/signup' className="login">
                    회원가입
                </Link>
            </div>
        </div>
    )
}
