import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // useAuth 훅을 사용합니다.
import '../pages/MyPage.css';

export default function MyReserve() {
    const [reservations, setReservations] = useState([]);
    const { token } = useAuth(); // AuthContext에서 토큰 정보를 가져옵니다.

    // 백엔드에서 예약 정보를 가져오는 함수
    const fetchReservations = async () => {
        // 토큰이 없으면 API를 호출하지 않습니다.
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5001/api/my-reservations', {
                headers: {
                    // API 요청 시 헤더에 인증 토큰을 포함합니다.
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                // 날짜 기준으로 내림차순 정렬
                const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setReservations(sorted);
            } else {
                console.error("예약 정보 로딩 실패:", data.message);
                // 토큰 만료 등의 경우 로그아웃 처리도 고려할 수 있습니다.
            }
        } catch (err) {
            console.error("예약 정보 로딩 중 오류:", err);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 예약 정보를 불러옵니다.
    useEffect(() => {
        fetchReservations();
    }, [token]); // 토큰이 변경될 때도 다시 불러옵니다.

    // 예약 취소 핸들러
    const handleDelete = async (reservationId) => {
        if (!window.confirm("정말로 이 예약을 취소하시겠습니까?")) return;
        
        try {
            const response = await fetch(`http://localhost:5001/api/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            const data = await response.json();
            
            if (data.success) {
                alert("예약이 취소되었습니다.");
                fetchReservations(); // 취소 성공 시 목록을 다시 불러옵니다.
            } else {
                alert(`취소 실패: ${data.message}`);
            }
        } catch (err) {
            alert("취소 처리 중 오류가 발생했습니다.");
            console.log(err);
        }
    };

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // UTC 날짜 문제를 해결하기 위해 타임존 오프셋을 고려
        const timeZoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + timeZoneOffset);
        const year = adjustedDate.getFullYear();
        const month = adjustedDate.getMonth() + 1;
        const day = adjustedDate.getDate();
        return `${year}년 ${month}월 ${day}일`;
    };

    return (
        <div className="MyReserve">
            <label>나의 예약 정보</label>
            {reservations.length === 0 ? (
                <p className="noReserve">예약 정보가 없습니다.<br/>상단의 로고를 눌러 예약을 진행해보세요!</p>
            ) : (
                <table className="reservationTable">
                    <thead>
                        <tr>
                            <th>날짜</th>
                            <th>시간</th>
                            <th>위치</th>
                            <th>좌석</th>
                            <th>예약자</th>
                            <th>전화번호</th>
                            <th>인원수</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((res) => (
                            <tr key={res.id}>
                                <td>{formatDate(res.date)}</td>
                                <td>{res.time === "lunch" ? "점심" : "저녁"}</td>
                                <td>{res.location}</td>
                                <td>{res.capacity}인석</td>
                                <td>{res.name}</td>
                                <td>{res.phone}</td>
                                <td>{res.peopleCount}명</td>
                                <td>
                                    <button
                                        className="deleteButton"
                                        onClick={() => handleDelete(res.id)} // res.id를 넘겨줍니다.
                                    >
                                        예약취소
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}