import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPlanned: 0,
  totalActual: 0,
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    // Set the entire budget
    setBudget: (state, action) => {
      state.items = action.payload.items || [];
      state.totalPlanned = action.payload.totalPlanned || 0;
      state.totalActual = action.payload.totalActual || 0;
      state.loading = false;
      state.error = null;
    },
    
    // Add a budget item locally (optimistic update)
    addBudgetItem: (state, action) => {
      state.items.push(action.payload);
      state.totalPlanned += action.payload.planned;
      state.totalActual += action.payload.actual || 0;
    },
    
    // Update a budget item locally (optimistic update)
    updateBudgetItem: (state, action) => {
      const { itemId, category, planned, actual } = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === itemId);
      
      if (itemIndex !== -1) {
        const oldPlanned = state.items[itemIndex].planned;
        const oldActual = state.items[itemIndex].actual || 0;
        
        if (category) state.items[itemIndex].category = category;
        if (planned !== undefined) state.items[itemIndex].planned = planned;
        if (actual !== undefined) state.items[itemIndex].actual = actual;
        
        // Update totals
        if (planned !== undefined) {
          state.totalPlanned = state.totalPlanned - oldPlanned + planned;
        }
        
        if (actual !== undefined) {
          state.totalActual = state.totalActual - oldActual + actual;
        }
      }
    },
    
    // Remove a budget item locally (optimistic update)
    removeBudgetItem: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === itemId);
      
      if (itemIndex !== -1) {
        state.totalPlanned -= state.items[itemIndex].planned;
        state.totalActual -= state.items[itemIndex].actual || 0;
        state.items.splice(itemIndex, 1);
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
  },
});

export const {
  setBudget,
  addBudgetItem,
  updateBudgetItem,
  removeBudgetItem,
  setLoading,
  setError,
  clearError,
} = budgetSlice.actions;

export default budgetSlice.reducer; 