import React from 'react';
import styled from 'styled-components';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameDay,
  subMonths,
  addMonths,
} from 'date-fns';

// Styled components for the calendar UI
const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px 0;
`;

const MonthDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4caf50;

  &:hover {
    color: #388e3c;
  }
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
`;

const Emoji = styled.span`
  font-size: 1.2rem;
`;

const Total = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const Calendar = ({ calendar, onUpdate, selectedDays, notes }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Navigate to previous month
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Generate the days for the current month
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

  // Handle day selection/deselection
  const handleDayClick = (day) => {
    if (calendar.locked) return; // Don't allow changes if locked

    const isSelected = selectedDays.some((selectedDay) => isSameDay(selectedDay, day));

    const updatedDays = isSelected
      ? selectedDays.filter((selectedDay) => !isSameDay(selectedDay, day))
      : [...selectedDays, day];

    // Update the selected days and add notes for that day
    onUpdate(calendar.id, {
      selectedDays: updatedDays,
      notes: { ...notes, [format(day, 'yyyy-MM-dd')]: calendar.emoji },
    });
  };

  // Format the current month name
  const monthName = format(currentDate, 'MMMM yyyy');

  return (
    <CalendarWrapper>
      <Navigation>
        <ArrowButton onClick={handlePreviousMonth}>←</ArrowButton>
        <MonthDisplay>{monthName}</MonthDisplay>
        <ArrowButton onClick={handleNextMonth}>→</ArrowButton>
      </Navigation>

      <CalendarGrid>
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {/* Days of the month */}
        {days.map((day, index) => {
          const isSelected = selectedDays.some((selectedDay) => isSameDay(selectedDay, day));
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          return (
            <Day
              key={index}
              selected={isSelected}
              color={calendar.color}
              onClick={() => handleDayClick(day)}
              style={{ opacity: isCurrentMonth ? 1 : 0.5 }}
            >
              {isSelected ? <Emoji>{calendar.emoji}</Emoji> : format(day, 'd')}
            </Day>
          );
        })}
      </CalendarGrid>

      <Total>Total days selected: {selectedDays.length}</Total>
    </CalendarWrapper>
  );
};

export default Calendar;
