import React, { useState, useEffect } from 'react';
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SaveButton = styled.button`
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #388e3c;
  }
`;

const saveCalendarsToStorage = (calendars) => {
  localStorage.setItem('calendars', JSON.stringify(calendars));
};

const Calendar = ({ calendar, onUpdate }) => {
  const [selectedDays, setSelectedDays] = useState(calendar.selectedDays || []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState(calendar.name);

  useEffect(() => {
    saveCalendarsToStorage(calendar);
  }, [calendar]);

  // Navigate to previous month
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

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
  
    // Update the selectedDays in the calendar state and notify the parent
    onUpdate({
      ...calendar,
      selectedDays: updatedDays,
      notes: { ...calendar.notes, [format(day, 'yyyy-MM-dd')]: calendar.emoji },
    });
  };
  
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveName = () => {
    onUpdate(calendar.id, { ...calendar, name: newName });
    handleCloseModal();
  };

  const monthName = format(currentDate, 'MMMM yyyy');

  return (
    <CalendarWrapper>
      {/* Navigation for Previous/Next Month */}
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

      {/* Total selected days */}
      <Total>Total days selected: {selectedDays.length}</Total>

      {/* Rename Calendar Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Rename Calendar</h2>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <SaveButton onClick={handleSaveName}>Save</SaveButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </CalendarWrapper>
  );
};

export default Calendar;
