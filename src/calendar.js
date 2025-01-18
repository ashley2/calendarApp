import React, { useState } from 'react';
import styled from 'styled-components';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameDay } from 'date-fns';

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MonthDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px 0;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  width: 100%;
`;

const DayHeader = styled.div`
  font-weight: bold;
  text-align: center;
`;

const Day = styled.div`
  width: 40px;
  height: 40px;
  background: ${(props) => (props.selected ? props.color : '#f1f1f1')};
  color: ${(props) => (props.selected ? 'white' : 'black')};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
`;

const Emoji = styled.span`
  font-size: 1.2rem;
`;

const Total = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const Calendar = ({ calendar, onUpdate }) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate dates for the current month
  const startOfTheMonth = startOfMonth(currentDate);
  const endOfTheMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(startOfTheMonth, { weekStartsOn: 0 });
  const endDate = addDays(startOfWeek(endOfTheMonth, { weekStartsOn: 0 }), 6);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handleDayClick = (day) => {
    if (calendar.locked) return;

    const isSelected = selectedDays.some((selectedDay) => isSameDay(selectedDay, day));

    const updatedDays = isSelected
      ? selectedDays.filter((selectedDay) => !isSameDay(selectedDay, day))
      : [...selectedDays, day];

    setSelectedDays(updatedDays);
    onUpdate(calendar.id, {
      notes: { ...calendar.notes, [format(day, 'yyyy-MM-dd')]: calendar.emoji },
    });
  };

  const monthName = format(currentDate, 'MMMM yyyy');

  return (
    <CalendarWrapper>
      <MonthDisplay>{monthName}</MonthDisplay>
      <CalendarGrid>
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {/* Days of the month */}
        {days.map((day, index) => (
          <Day
            key={index}
            selected={selectedDays.some((selectedDay) => isSameDay(selectedDay, day))}
            color={calendar.color}
            onClick={() => handleDayClick(day)}
          >
            {format(day, 'd')}
            {selectedDays.some((selectedDay) => isSameDay(selectedDay, day)) && (
              <Emoji>{calendar.emoji}</Emoji>
            )}
          </Day>
        ))}
      </CalendarGrid>
      <Total>Total Days Marked: {selectedDays.length}</Total>
    </CalendarWrapper>
  );
};

export default Calendar;
