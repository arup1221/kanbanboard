import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useKanban } from "../../Context/KanbanSlice";
import "./styles.css";

const TaskCard = ({ task, columnId, onEdit }) => {
  const { dispatch } = useKanban();

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("fromColumn", columnId);
  };

  const handleDelete = () => {
    dispatch({
      type: "DELETE_TASK",
      payload: { columnId, taskId: task.id },
    });
  };

  return (
    <div className="task-card" draggable onDragStart={handleDragStart}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="edit-btn">
            <Pencil size={16} />
          </button>
          <button onClick={handleDelete} className="delete-btn">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-date">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

export default TaskCard;
