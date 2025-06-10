import { dummyTables } from "./dummyTables"
import { Link } from 'react-router-dom';


export default function HomeContent() {
    return(
        <div className="Home_content">
            <div className="Home_Text">오늘 예약 가능한 테이블</div>
            <div className="AvailTabel">
                {dummyTables.map((table) => (
                    <div key={table.id} className="table-card">
                        <img src={table.image} alt={`${table.type} ${table.location}`} className="table_img"/>
                        <div className="table_detail">
                            <p>{table.type} {table.location}</p>
                            <Link to='/login' className="reserve_login">예약하기</Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="moreTable">
                <Link to='/login' className="more_login">더보기</Link>
            </div>
        </div>
    )
}