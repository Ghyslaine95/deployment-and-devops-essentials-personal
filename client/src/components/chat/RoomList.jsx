import React, { useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const RoomList = () => {
  const { rooms, currentRoom, joinRoom, unreadCounts } = useSocketContext();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      // Implement room creation
      console.log('Creating room:', newRoomName);
      setNewRoomName('');
      setShowCreateRoom(false);
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chat Rooms</h2>
        <Button
          size="small"
          onClick={() => setShowCreateRoom(true)}
          className="bg-gray-700 hover:bg-gray-600"
        >
          +
        </Button>
      </div>

      <div className="space-y-1">
        {rooms.map((room) => (
          <button
            key={room.name}
            onClick={() => joinRoom(room.name)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
              currentRoom === room.name
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span># {room.name}</span>
            {unreadCounts[room.name] > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                {unreadCounts[room.name]}
              </span>
            )}
          </button>
        ))}
      </div>

      <Modal
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        title="Create New Room"
        size="small"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <Input
            placeholder="Room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateRoom(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newRoomName.trim()}
            >
              Create Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};