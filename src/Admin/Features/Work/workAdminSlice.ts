import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workApi } from '../../AdminApi/workApi';
import type { IWork } from '../../../types/work';

// Estado del slice
interface WorkState {
 

    works: IWork[];
    selectedWork: IWork | null;
    adminLoading: boolean;

    error: string | null;
}

// Estado inicial
const initialState: WorkState = {
    works: [],
    selectedWork: null,
    adminLoading: false,

    error: null
};


// Thunks autenticados
export const getAllWorks = createAsyncThunk(
    'work/getAllWorks',
    async (_, { rejectWithValue }) => {
        try {
            return await workApi.getAll();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar trabajos');
        }
    }
);



const adminWorkSlice = createSlice({
    name: 'work',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectWork: (state, action) => {
            state.selectedWork = action.payload;
        },
        clearSelectedWork: (state) => {
            state.selectedWork = null;
        }
    },
    extraReducers: (builder) => {
        // Get all works (admin)
        builder
            .addCase(getAllWorks.pending, (state) => {
                state.adminLoading = true;
                state.error = null;
            })
            .addCase(getAllWorks.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.works = action.payload;
            })
            .addCase(getAllWorks.rejected, (state, action) => {
                state.adminLoading = false;
                state.error = action.payload as string;
            });


    }
});

export const { clearError, selectWork, clearSelectedWork  } = adminWorkSlice.actions;
export default adminWorkSlice.reducer;
