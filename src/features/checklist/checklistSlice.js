import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  completedCount: 0,
  totalCount: 0,
  loading: false,
  error: null,
};

const checklistSlice = createSlice({
  name: 'checklist',
  initialState,
  reducers: {
    // Set the entire checklist
    setChecklist: (state, action) => {
      state.items = action.payload.items || [];
      state.completedCount = action.payload.completedCount || 0;
      state.totalCount = action.payload.totalCount || 0;
      state.loading = false;
      state.error = null;
    },
    
    // Add a task locally (optimistic update)
    addTask: (state, action) => {
      state.items.push(action.payload);
      state.totalCount += 1;
    },
    
    // Toggle task completion status locally (optimistic update)
    toggleTask: (state, action) => {
      const taskId = action.payload;
      const task = state.items.find(item => item._id === taskId);
      
      if (task) {
        task.completed = !task.completed;
        state.completedCount = task.completed 
          ? state.completedCount + 1 
          : state.completedCount - 1;
      }
    },
    
    // Remove a task locally (optimistic update)
    removeTask: (state, action) => {
      const taskId = action.payload;
      const taskIndex = state.items.findIndex(item => item._id === taskId);
      
      if (taskIndex !== -1) {
        const wasCompleted = state.items[taskIndex].completed;
        state.items.splice(taskIndex, 1);
        state.totalCount -= 1;
        
        if (wasCompleted) {
          state.completedCount -= 1;
        }
      }
    },
    
    // Set loading state
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Set error state
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetChecklistState: () => initialState,
  },
});

export const {
  setChecklist,
  addTask,
  toggleTask,
  removeTask,
  setLoading,
  setError,
  clearError,
  resetChecklistState,
} = checklistSlice.actions;

export default checklistSlice.reducer; 