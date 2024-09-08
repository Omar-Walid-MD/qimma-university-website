import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDepartments, getFaculties } from '../../Utils/queryFunctions';

const initialState = {
    faculties: [],
    departments: [],
    loading: true
}


export const getAllFacultiesData = createAsyncThunk(
    'auth/getAllFacultiesData',
    async () => {
      const res = await getFaculties();
      return res;
});

export const getAllDepartmentsData = createAsyncThunk(
    'auth/getAllDepartmentsData',
    async () => {
      const res = await getDepartments();
      return res;
});

export const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder

      //getAllFacultiesData
      .addCase(getAllFacultiesData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllFacultiesData.fulfilled, (state, action) => {
        state.faculties = action.payload;
        state.loading = false;
      })
      .addCase(getAllFacultiesData.rejected, (state, action) => {
        state.loading = false;
      })

       //getAllDepartmentsData
       .addCase(getAllDepartmentsData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllDepartmentsData.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.loading = false;
      })
      .addCase(getAllDepartmentsData.rejected, (state, action) => {
        state.loading = false;
      })

      
    },
});

export default dataSlice.reducer;