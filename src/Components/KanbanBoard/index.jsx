import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useKanban } from "../../Context/KanbanSlice";
import  Column  from "../Column";
import  TaskModal  from "../TaskModel";
import "./styles.css";

const  KanbanBoard= () => {
  const { state, dispatch } = useKanban();
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.isDarkMode]);

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (selectedTask) {
      dispatch({
        type: "EDIT_TASK",
        payload: {
          taskId: selectedTask.id,
          updates: taskData,
        },
      });
    } else if (selectedColumn) {
      const newTask = {
        id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description,
        status: selectedColumn,
        createdAt: Date.now(),
      };
      dispatch({
        type: "ADD_TASK",
        payload: {
          columnId: selectedColumn,
          task: newTask,
        },
      });
    }
  };

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  return (
    <div className="kanban-container">
      <div className="kanban-wrapper">
        <div className="kanban-header">
          <h1 className="kanban-title">Kanban Board</h1>
          <button onClick={toggleTheme} className="theme-toggle">
            {state.isDarkMode ? (
              <Sun className="icon-light" size={24} />
            ) : (
              <Moon className="icon-dark" size={24} />
            )}
          </button>
        </div>
        <div className="kanban-columns">
          {state.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
      />
    </div>
  );
}
export default KanbanBoard;
