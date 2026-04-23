import React, { useState } from 'react';
import './PropertyPanel.css';

const PropertyPanel = ({ workstation, onUpdate }) => {
  const [name, setName] = useState(workstation.name);
  const [capacity, setCapacity] = useState(workstation.capacity);
  const [duration, setDuration] = useState(workstation.duration);

  const handleSave = () => {
    onUpdate({
      ...workstation,
      name,
      capacity: parseInt(capacity),
      duration: parseInt(duration),
    });
  };

  return (
    <div className="property-panel">
      <h3>Paramètres du Poste</h3>
      
      <div className="property-group">
        <label>Nom du Poste:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
        />
      </div>

      <div className="property-group">
        <label>Capacité (pièces/heure):</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          onBlur={handleSave}
          min="1"
        />
      </div>

      <div className="property-group">
        <label>Durée (secondes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          onBlur={handleSave}
          min="1"
        />
      </div>

      <div className="info-box">
        <p><strong>ID:</strong> {workstation.id}</p>
        <p><strong>Position:</strong> ({Math.round(workstation.x)}, {Math.round(workstation.y)})</p>
      </div>
    </div>
  );
};

export default PropertyPanel;