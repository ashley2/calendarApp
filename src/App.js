import React, { useState, useEffect } from 'react';
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
  // Load initial state from localStorage, if available
  const loadCalendarsFromStorage = () => {
    const savedCalendars = localStorage.getItem('calendars');
    return savedCalendars ? JSON.parse(savedCalendars) : [
      { id: 1, name: 'Default', emoji: '📅', color: '#4CAF50', locked: false, notes: {}, selectedDays: [], alert: false },
    ];
  };

  const [calendars, setCalendars] = useState(loadCalendarsFromStorage());
  const [activeTab, setActiveTab] = useState(1);

  // Save calendars to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendars', JSON.stringify(calendars));
  }, [calendars]);

  // Add a new calendar
  const handleAddCalendar = () => {
    const newCalendar = {
      id: Date.now(), // Unique ID for the new calendar
      name: 'New Calendar',
      emoji: '📅',
      color: '#4CAF50',
      locked: false,
      notes: {},
      selectedDays: [],
      alert: false,
    };
    setCalendars([...calendars, newCalendar]);
    setActiveTab(newCalendar.id); // Set new calendar as the active one
  };

  // Update a specific calendar's data
  const handleUpdateCalendar = (id, updatedCalendar) => {
    setCalendars(calendars.map((cal) => (cal.id === id ? { ...cal, ...updatedCalendar } : cal)));
  };

  // Delete a calendar
  const handleDeleteCalendar = (id) => {
    setCalendars(calendars.filter((cal) => cal.id !== id));
    if (activeTab === id && calendars.length > 1) {
      setActiveTab(calendars[0].id); // Set first calendar as active if the current one is deleted
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

      {/* Pass the active calendar's data and update/delete functions to the CalendarMenu */}
      <CalendarMenu
        calendar={calendars.find((cal) => cal.id === activeTab)}
        onUpdate={handleUpdateCalendar}
        onDelete={handleDeleteCalendar}
      />
      
      {/* Pass the active calendar's data, selectedDays, and notes to the Calendar */}
      <Calendar
        calendar={calendars.find((cal) => cal.id === activeTab)}
        onUpdate={handleUpdateCalendar}
        selectedDays={calendars.find((cal) => cal.id === activeTab).selectedDays}
        notes={calendars.find((cal) => cal.id === activeTab).notes}
      />
    </AppContainer>
  );
};

export default App;
