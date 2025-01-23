import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from './calendar';

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

  &:hover {
    background: #388e3c;
  }
`;

const loadCalendarsFromStorage = () => {
  const savedCalendars = localStorage.getItem('calendars');
  return savedCalendars ? JSON.parse(savedCalendars) : [];
};

const App = () => {
  const [calendars, setCalendars] = useState(loadCalendarsFromStorage());
  const [activeTab, setActiveTab] = useState(calendars[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    // Save calendars to local storage when they change
    localStorage.setItem('calendars', JSON.stringify(calendars));
  }, [calendars]);

  // Ensure the calendar state is updated correctly when a change happens
  const handleUpdateCalendar = (updatedCalendar) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((cal) =>
        cal.id === updatedCalendar.id ? updatedCalendar : cal
      )
    );
  };

  const handleAddCalendar = () => {
    const newCalendar = {
      id: Date.now(),
      name: 'New Calendar',
      emoji: '👣',
      color: '#4CAF50',
      locked: false,
      notes: {},
      selectedDays: [],
    };
    setCalendars([...calendars, newCalendar]);
    setActiveTab(newCalendar.id);
  };

  const handleOpenModal = (id) => {
    setActiveTab(id);
    setNewName(calendars.find((cal) => cal.id === id).name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewName(''); // Clear the input field when closing the modal
  };

  const handleSaveName = () => {
    setCalendars(
      calendars.map((cal) =>
        cal.id === activeTab ? { ...cal, name: newName } : cal
      )
    );
    handleCloseModal();
  };

  return (
    <AppContainer>
      <TabsContainer>
        {calendars.map((cal) => (
          <Tab
            key={cal.id}
            active={cal.id === activeTab}
            onDoubleClick={() => handleOpenModal(cal.id)}
            onClick={() => setActiveTab(cal.id)}
          >
            {cal.name}
          </Tab>
        ))}
        <Tab onClick={handleAddCalendar}>+ Add Calendar</Tab>
      </TabsContainer>

      {calendars.length > 0 && (
        <Calendar
          key={activeTab} // Ensure it's correctly keyed so React knows when it needs to re-render
          calendar={calendars.find((cal) => cal.id === activeTab)}
          onUpdate={handleUpdateCalendar}
        />
      )}

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
    </AppContainer>
  );
};

export default App;
