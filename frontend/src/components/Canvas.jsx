import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Arrow, Text } from 'react-konva';
import Konva from 'konva';
import PropertyPanel from './PropertyPanel';
import './Canvas.css';

const Canvas = () => {
  const stageRef = useRef(null);
  const [workstations, setWorkstations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedWorkstation, setSelectedWorkstation] = useState(null);
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const STAGE_WIDTH = window.innerWidth - 300;
  const STAGE_HEIGHT = window.innerHeight - 100;

  // Add new workstation via drag-drop from toolbar
  const addWorkstation = (e) => {
    const stage = stageRef.current.getStage();
    const pos = stage.getPointerPosition();
    
    const newWorkstation = {
      id: Date.now(),
      x: pos.x,
      y: pos.y,
      width: 120,
      height: 80,
      name: `Poste ${workstations.length + 1}`,
      capacity: 100,
      duration: 60,
      isDragging: false,
    };

    setWorkstations([...workstations, newWorkstation]);
  };

  const handleWorkstationDragStart = (id) => {
    setWorkstations(
      workstations.map((ws) =>
        ws.id === id ? { ...ws, isDragging: true } : ws
      )
    );
  };

  const handleWorkstationDragEnd = (id, newX, newY) => {
    setWorkstations(
      workstations.map((ws) =>
        ws.id === id ? { ...ws, x: newX, y: newY, isDragging: false } : ws
      )
    );
  };

  const startConnection = (id) => {
    const ws = workstations.find((w) => w.id === id);
    setConnectionStart(id);
    setIsDrawingConnection(true);
  };

  const endConnection = (targetId) => {
    if (connectionStart && connectionStart !== targetId) {
      const newConnection = {
        id: Date.now(),
        from: connectionStart,
        to: targetId,
      };
      setConnections([...connections, newConnection]);
    }
    setIsDrawingConnection(false);
    setConnectionStart(null);
  };

  const handleMouseMove = (e) => {
    if (isDrawingConnection) {
      const stage = stageRef.current.getStage();
      const pos = stage.getPointerPosition();
      setMousePos({ x: pos.x, y: pos.y });
    }
  };

  const getWorkstationCenter = (id) => {
    const ws = workstations.find((w) => w.id === id);
    if (ws) {
      return { x: ws.x + ws.width / 2, y: ws.y + ws.height / 2 };
    }
    return { x: 0, y: 0 };
  };

  const deleteWorkstation = (id) => {
    setWorkstations(workstations.filter((ws) => ws.id !== id));
    setConnections(connections.filter((c) => c.from !== id && c.to !== id));
    setSelectedWorkstation(null);
  };

  return (
    <div className="canvas-container">
      <div className="toolbar">
        <button onClick={addWorkstation} className="btn-add-workstation">
          + Ajouter Poste
        </button>
        {selectedWorkstation && (
          <button
            onClick={() => deleteWorkstation(selectedWorkstation.id)}
            className="btn-delete"
          >
            🗑️ Supprimer
          </button>
        )}
      </div>

      <div className="canvas-wrapper">
        <Stage
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          ref={stageRef}
          onMouseMove={handleMouseMove}
          className="canvas-stage"
        >
          <Layer>
            {connections.map((conn) => {
              const from = getWorkstationCenter(conn.from);
              const to = getWorkstationCenter(conn.to);
              return (
                <Arrow
                  key={conn.id}
                  points={[from.x, from.y, to.x, to.y]}
                  stroke="#333"
                  strokeWidth={2}
                  fill="#333"
                  pointerLength={15}
                  pointerWidth={12}
                />
              );
            })}

            {isDrawingConnection && connectionStart && (
              <Arrow
                points={[
                  getWorkstationCenter(connectionStart).x,
                  getWorkstationCenter(connectionStart).y,
                  mousePos.x,
                  mousePos.y,
                ]}
                stroke="#ccc"
                strokeWidth={2}
                pointerLength={15}
                pointerWidth={12}
                dash={[5, 5]}
              />
            )}

            {workstations.map((ws) => (
              <React.Fragment key={ws.id}>
                <Rect
                  x={ws.x}
                  y={ws.y}
                  width={ws.width}
                  height={ws.height}
                  fill={selectedWorkstation?.id === ws.id ? '#4CAF50' : '#2196F3'}
                  stroke={selectedWorkstation?.id === ws.id ? '#388E3C' : '#1976D2'}
                  strokeWidth={2}
                  cornerRadius={5}
                  draggable
                  onDragStart={() => handleWorkstationDragStart(ws.id)}
                  onDragEnd={(e) => handleWorkstationDragEnd(ws.id, e.target.x(), e.target.y())}
                  onClick={() => setSelectedWorkstation(ws)}
                  onMouseEnter={(e) => {
                    e.target.getStage().container.style.cursor = 'move';
                  }}
                  onMouseLeave={(e) => {
                    e.target.getStage().container.style.cursor = 'default';
                  }}
                  onContextMenu={(e) => {
                    e.evt.preventDefault();
                    startConnection(ws.id);
                  }}
                  onMouseUp={() => {
                    if (isDrawingConnection) {
                      endConnection(ws.id);
                    }
                  }}
                />
                <Text
                  x={ws.x}
                  y={ws.y + ws.height / 2 - 15}
                  width={ws.width}
                  text={ws.name}
                  fontSize={14}
                  fontFamily="Arial"
                  fill="#fff"
                  align="center"
                  pointerEvents="none"
                />
                <Text
                  x={ws.x}
                  y={ws.y + ws.height / 2 + 5}
                  width={ws.width}
                  text={`${ws.capacity} u/h`}
                  fontSize={11}
                  fontFamily="Arial"
                  fill="#fff"
                  align="center"
                  pointerEvents="none"
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>

      {selectedWorkstation && (
        <PropertyPanel
          workstation={selectedWorkstation}
          onUpdate={(updated) => {
            setWorkstations(
              workstations.map((ws) =>
                ws.id === updated.id ? updated : ws
              )
            );
            setSelectedWorkstation(updated);
          }}
        />
      )}
    </div>
  );
};

export default Canvas;
