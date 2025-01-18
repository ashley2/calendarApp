import React, { useState } from 'react';
import styled from 'styled-components';

const Menu = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 5px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ColorPicker = styled.input`
  margin: 5px;
`;

const Button = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

const CalendarMenu = ({ calendar, onUpdate, onDelete }) => {
  const [name, setName] = useState(calendar.name);
  const [color, setColor] = useState(calendar.color);

  const handleUpdate = () => {
    onUpdate(calendar.id, { name, color });
  };

  return (
    <Menu>
      <div>
        <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={handleUpdate} />
        <ColorPicker
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          onBlur={handleUpdate}
        />
      </div>
      <Button onClick={() => onDelete(calendar.id)}>Delete Calendar</Button>
    </Menu>
  );
};

export default CalendarMenu;
