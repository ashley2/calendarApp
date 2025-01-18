import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from './calendar';
import CalendarMenu from './calendarMenu';

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: ${(props) => (props.active ? '#4CAF50' : '#f1f1f1')};
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  color: ${(props) => (props.active ? 'white' : 'black')};
`;

const App = () => {
  const [calendars, setCalendars] = useState([
    { id: 1, name: 'Default', emoji: '📅', color: '#4CAF50', locked: false, notes: {}, alert: false },
  ]);
  const [activeTab, setActiveTab] = useState(1);

  const handleAddCalendar = () => {
    const newCalendar = {
      id: Date.now(),
      name: 'New Calendar',
      emoji: '📅',
      color: '#4CAF50',
      locked: false,
      notes: {},
      alert: false,
    };
    setCalendars([...calendars, newCalendar]);
    setActiveTab(newCalendar.id);
  };

  const handleUpdateCalendar = (id, updatedCalendar) => {
    setCalendars(calendars.map((cal) => (cal.id === id ? { ...cal, ...updatedCalendar } : cal)));
  };

  const handleDeleteCalendar = (id) => {
    setCalendars(calendars.filter((cal) => cal.id !== id));
    if (activeTab === id && calendars.length > 1) {
      setActiveTab(calendars[0].id);
    }
  };

  return (
    <AppContainer>
      <TabsContainer>
        {calendars.map((cal) => (
          <Tab key={cal.id} active={cal.id === activeTab} onClick={() => setActiveTab(cal.id)}>
            {cal.name}
          </Tab>
        ))}
        <Tab onClick={handleAddCalendar}>+ Add Calendar</Tab>
      </TabsContainer>
      <CalendarMenu
        calendar={calendars.find((cal) => cal.id === activeTab)}
        onUpdate={handleUpdateCalendar}
        onDelete={handleDeleteCalendar}
      />
      <Calendar
        calendar={calendars.find((cal) => cal.id === activeTab)}
        onUpdate={handleUpdateCalendar}
      />
    </AppContainer>
  );
};

export default App;
