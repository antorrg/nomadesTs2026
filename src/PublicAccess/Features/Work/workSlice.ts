import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workPublicApi } from '../../publicApi/workApi';
import type { IWork } from '../../../types/work';

// Estado del slice
interface WorkState {
    publicWorks: IWork[];
    selectedPublicWork: IWork | null;
    publicLoading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: WorkState = {
    publicWorks: [],
    selectedPublicWork: null,
    publicLoading: false,

    error: null
};

// Thunks públicos
export const getPublicWorks = createAsyncThunk(
    'work/getPublicWorks',
    async (_, { rejectWithValue }) => {
        try {
             return await workPublicApi.getAllPublic();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar trabajos');
        }
    }
);
// Thunks públicos
export const getPublicWorkById = createAsyncThunk(
    'work/getPublicWorkById',
    async (id:number, { rejectWithValue }) => {
        try {
             return await workPublicApi.getPublicById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar trabajo');
        }
    }
);


const workSlice = createSlice({
    name: 'work',
    initialState,
    reducers: {
  
        selectWork: (state, action) => {
            state.selectedPublicWork = action.payload;
        },
        clearSelectedWork: (state) => {
            state.selectedPublicWork = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get public works
        builder
            .addCase(getPublicWorks.pending, (state) => {
                state.publicLoading = true;
                state.error = null;
            })
            .addCase(getPublicWorks.fulfilled, (state, action) => {
                state.publicLoading = false;
                state.publicWorks = action.payload;
            })
            .addCase(getPublicWorks.rejected, (state, action) => {
                state.publicLoading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(getPublicWorkById.pending, (state) => {
                state.publicLoading = true;
                state.error = null;
            })
            .addCase(getPublicWorkById.fulfilled, (state, action) => {
                state.publicLoading = false;
                state.selectedPublicWork = action.payload;
            })
            .addCase(getPublicWorkById.rejected, (state, action) => {
                state.publicLoading = false;
                state.error = action.payload as string;
            });




    }
});

export const { clearError, selectWork, clearSelectedWork } = workSlice.actions;
export default workSlice.reducer;
