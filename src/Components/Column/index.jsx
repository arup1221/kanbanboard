import React from "react";
import { Plus } from "lucide-react";
import { useKanban } from "../../Context/KanbanSlice";
import TaskCard from "../TaskCard";
import "./styles.css";

const Column = ({ column, onAddTask, onEditTask }) => {
  const { dispatch } = useKanban();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData("taskId");
    const fromColumn = e.dataTransfer.getData("fromColumn");

    if (fromColumn !== column.id) {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          taskId,
          fromColumn,
          toColumn: column.id,
        },
      });
    }
  };

  return (
    <div className="column" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <button onClick={() => onAddTask(column.id)} className="add-task-btn">
          <Plus size={20} />
        </button>
      </div>
      <div className="task-list">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            onEdit={onEditTask}
          />
        ))}
      </div>
    </div>
  );
};
export default Column;
