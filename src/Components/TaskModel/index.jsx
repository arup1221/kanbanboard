import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './styles.css';

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description });
    onClose();
    setTitle('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default TaskModal;