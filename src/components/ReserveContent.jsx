import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DatePicker from "./DatePicker";
import '../pages/ReservationPage.css';

export default function ReserveContent() {
    // 인증 정보
    const { token } = useAuth();
    const navigate = useNavigate();

    // 예약 양식 상태
    const [date, setDate] = useState(null);
    const [time, setTime] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [peopleCount, setPeopleCount] = useState("");
    
    // API로부터 받아온 예약 가능 테이블 목록 상태
    const [availableTables, setAvailableTables] = useState([]);
    
    // 사용자가 선택한 테이블 정보 상태
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState(null);

    // 날짜를 YYYY-MM-DD 형식의 문자열로 변환하는 함수
    const formatDateForAPI = (dateObj) => {
        if (!dateObj) return null;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 1. 날짜나 시간이 변경될 때마다 실행되는 부분 (문제 2 해결)
    useEffect(() => {
        // 날짜와 시간이 모두 선택되었을 때만 API 호출
        if (date && time && token) {
            const formattedDate = formatDateForAPI(date);
            
            fetch(`http://localhost:5001/api/tables/available?date=${formattedDate}&time=${time}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                setAvailableTables(data);
                // 선택지가 바뀌었으므로 기존 선택 초기화
                setSelectedLocation('');
                setSelectedCapacity(null);
            })
            .catch(err => console.error("예약 가능 테이블 조회 실패:", err));
        }
    }, [date, time, token]);

    // 2. 예약 제출 핸들러 (문제 1 해결)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !time || !selectedLocation || !selectedCapacity || !name || !phone || !cardNumber || !peopleCount) {
            alert("모든 필수 정보를 선택하고 입력해주세요.");
            return;
        }

        const reservationData = {
            date: formatDateForAPI(date),
            time,
            location: selectedLocation,
            capacity: selectedCapacity,
            name,
            phone,
            cardNumber,
            peopleCount
        };

        try {
            const response = await fetch('http://localhost:5001/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservationData)
            });
            const data = await response.json();

            if (data.success) {
                alert("예약이 성공적으로 완료되었습니다!");
                navigate("/MyReserve"); // 나의 예약 페이지로 이동
            } else {
                alert(`예약 실패: ${data.message}`);
            }
        } catch (err) {
            alert("예약 처리 중 오류가 발생했습니다.");
            console.log(err);
        }
    };

    // availableTables 데이터로부터 유니크한 위치 목록을 계산
    const locations = useMemo(() => {
        const locationSet = new Set(availableTables.map(table => table.location));
        return Array.from(locationSet);
    }, [availableTables]);

    // 선택된 위치에 해당하는 수용인원 목록 계산
    const capacitiesForSelectedLocation = useMemo(() => {
        if (!selectedLocation) return [];
        return availableTables
            .filter(table => table.location === selectedLocation)
            .map(table => table.capacity);
    }, [availableTables, selectedLocation]);

    return (
        <form className="ReserveContent" onSubmit={handleSubmit}>
            <div className="form_content">
                <div className="left">
                    <div className="selectDateTime">
                        <label>예약하려는 날짜와 시간을 선택해주세요</label>
                        <div className="dateAndTime">
                            <DatePicker selected={date} onChange={setDate} />
                            <select value={time} onChange={(e) => setTime(e.target.value)} className="SelectTime" required>
                                <option value="">-- 시간 선택 --</option>
                                <option value="lunch">점심</option>
                                <option value="dinner">저녁</option>
                            </select>
                        </div>
                    </div>

                    {locations.length > 0 && (
                        <div className="selectTable">
                            <label>원하는 좌석 위치를 선택해주세요</label>
                            <div className='locationButtonGroup'>
                                {locations.map((location) => (
                                    <button key={location} type="button" className={`locationButton ${selectedLocation === location ? 'selected' : ''}`} onClick={() => { setSelectedLocation(location); setSelectedCapacity(null); }}>
                                        {location}
                                    </button>
                                ))}
                            </div>
                            
                            {selectedLocation && (
                                <div className="capacitySection">
                                    <p className="seatLabel">'{selectedLocation}'의 예약 가능한 좌석입니다.</p>
                                    <div className="capacityButtonGroup">
                                        {capacitiesForSelectedLocation.map((cap) => (
                                            <button key={cap} type="button" className={`capacityButton ${selectedCapacity === cap ? 'selected' : ''}`} onClick={() => setSelectedCapacity(cap)}>
                                                {cap}인석
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="right">
                    {date && time && selectedLocation && selectedCapacity && (
                        <div className="input_form">
                            {/* ... (이하 정보 입력 필드들은 기존과 유사하게 유지) ... */}
                            <div className="formRow "><label>이름</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                            <div className="formRow "><label>전화번호</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
                            <div className="formRow "><label>카드번호</label><input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required /></div>
                            <div className="formRow "><label>인원수</label><input type="number" min="1" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} required /></div>
                            <button type="submit" className="submit_btn">예약하기</button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}