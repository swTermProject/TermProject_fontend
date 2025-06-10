import React, {useState, useEffect } from 'react'
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'

export default function DatePicker({selected, onChange}) {
  const [date, setDate] = useState(selected || new Date())
  const [error, setError] = useState('');


  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  useEffect(()=> {
    if(selected) setDate(selected)
  }, [selected])

  // const today = useMemo(()=> new Date(), [])

  const handleChange = d => {
    if(date > oneMonthLater) {
      setError("한달 내의 날짜만 예약 가능합니다.");
      return;
    }

    setDate(d)
    if (onChange) onChange(d)
  }

  return (
    <div>
      <ReactDatePicker
          inline
          shouldCloseOnSelect={false}
          dateFormat="yyyy/MM/dd"
          selected={date}
          onChange={handleChange}
          minDate={today}
          maxDate={oneMonthLater}
          className="Datepicker"
          placeholderText="날짜를 입력해 주세요"
          renderCustomHeader={({  
          monthDate,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="custom-header">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
            >
              {'<'}
            </button>
            <span>
              {monthDate.getMonth() + 1}월 {monthDate.getFullYear()}년
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              {'>'}
            </button>
          </div>
        )}
      />
      {error && <p className="errorMessage">{error}</p>}
    </div>
  )
}