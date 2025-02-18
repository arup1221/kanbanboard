import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialColumns = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'inProgress', title: 'In Progress', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

const getInitialState = () => {
  try {
    const savedState = JSON.parse(localStorage.getItem('kanbanState'));
    if (savedState && Array.isArray(savedState.columns)) {
      return savedState;
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return { columns: initialColumns, isDarkMode: false }; 
};

const KanbanContext = createContext(null);

function kanbanReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const { columnId, task } = action.payload;
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
        ),
      };
    }
    case 'EDIT_TASK': {
      const { taskId, updates } = action.payload;
      return {
        ...state,
        columns: state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),
      };
    }
    case 'DELETE_TASK': {
      const { columnId, taskId } = action.payload;
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
            : col
        ),
      };
    }
    case 'MOVE_TASK': {
      const { taskId, fromColumn, toColumn } = action.payload;
      const task = state.columns
        .find((col) => col.id === fromColumn)
        ?.tasks.find((t) => t.id === taskId);

      if (!task) return state;

      return {
        ...state,
        columns: state.columns.map((col) => {
          if (col.id === fromColumn) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
          }
          if (col.id === toColumn) {
            return { ...col, tasks: [...col.tasks, { ...task, status: toColumn }] };
          }
          return col;
        }),
      };
    }
    case 'ADD_COLUMN': {
      return {
        ...state,
        columns: [...state.columns, action.payload.column],
      };
    }
    case 'TOGGLE_THEME': {
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    }
    default:
      return state;
  }
}

// needed shift 

// provider fuctions 

export function KanbanProvider({ children }) {
  const [state, dispatch] = useReducer(kanbanReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('kanbanState', JSON.stringify(state));
  }, [state]); 

  return <KanbanContext.Provider value={{ state, dispatch }}>{children}</KanbanContext.Provider>;
}

// useKanban hook

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
