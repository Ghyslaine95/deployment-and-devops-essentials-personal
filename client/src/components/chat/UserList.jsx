import React, { useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const UserList = () => {
  const { users, user: currentUser, sendPrivateMessage } = useSocketContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMessage, setPrivateMessage] = useState('');
  const [showPrivateModal, setShowPrivateModal] = useState(false);

  const handlePrivateMessage = (user) => {
    setSelectedUser(user);
    setShowPrivateModal(true);
  };

  const sendPrivateMessageHandler = (e) => {
    e.preventDefault();
    if (privateMessage.trim() && selectedUser) {
      sendPrivateMessage(selectedUser.id, privateMessage.trim());
      setPrivateMessage('');
      setShowPrivateModal(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-l p-4">
      <h3 className="font-semibold text-gray-700 mb-4">Online Users ({users.length})</h3>
      
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">
                {user.username}
                {user.username === currentUser?.username && ' (You)'}
              </span>
            </div>
            
            {user.username !== currentUser?.username && (
              <Button
                variant="outline"
                size="small"
                onClick={() => handlePrivateMessage(user)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Message
              </Button>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={showPrivateModal}
        onClose={() => setShowPrivateModal(false)}
        title={`Private Message to ${selectedUser?.username}`}
        size="small"
      >
        <form onSubmit={sendPrivateMessageHandler} className="space-y-4">
          <Input
            placeholder="Type your private message..."
            value={privateMessage}
            onChange={(e) => setPrivateMessage(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPrivateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!privateMessage.trim()}
            >
              Send
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};