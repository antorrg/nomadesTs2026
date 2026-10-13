import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { highLightApi } from '../../AdminApi/highLightApi';
import type { IHightLight } from '../../../types/hightLight';

// Estado del slice
interface HighLightState {
    highLights: IHightLight[];
    selectedHighLight: IHightLight | null;
    adminLoading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: HighLightState = {
    highLights: [],
    selectedHighLight: null,
    adminLoading: false,
    error: null
};


// Thunks autenticados
export const getAllHighLights = createAsyncThunk(
    'adminHigh/getAllHighLights',
    async (_, { rejectWithValue }) => {
        try {
            return await highLightApi.getAll();
        } catch (error: any) {//eslint-disable-line
            return rejectWithValue(error.response?.data?.message || 'Error al cargar destacados');
        }
    }
);

export const getHighLightById = createAsyncThunk(
    'adminHigh/getHighLightById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await highLightApi.getById(id);
        } catch (error: any) {//eslint-disable-line
            return rejectWithValue(error.response?.data?.message || 'Error al cargar destacado');
        }
    }
);

export const deleteHighLight = createAsyncThunk(
    'adminHigh/deleteHighLight',
    async (id: number, { rejectWithValue }) => {
        try {
            await highLightApi.delete(id);
            return id;
        } catch (error: any) {//eslint-disable-line
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar destacado');
        }
    }
);


const adminHighLightSlice = createSlice({
    name: 'adminHigh',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectHighLight: (state, action) => {
            state.selectedHighLight = action.payload;
        },
        clearSelectedHighLight: (state) => {
            state.selectedHighLight = null;
        }
    },
    extraReducers: (builder) => {
        // Get all (admin)
        builder
            .addCase(getAllHighLights.pending, (state) => {
                state.adminLoading = true;
                state.error = null;
            })
            .addCase(getAllHighLights.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.highLights = action.payload;
            })
            .addCase(getAllHighLights.rejected, (state, action) => {
                state.adminLoading = false;
                state.error = action.payload as string;
            })
            // Get by ID
            .addCase(getHighLightById.pending, (state) => {
                state.adminLoading = true;
                state.error = null;
            })
            .addCase(getHighLightById.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.selectedHighLight = action.payload;
            })
            .addCase(getHighLightById.rejected, (state, action) => {
                state.adminLoading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteHighLight.pending, (state) => {
                state.adminLoading = true;
                state.error = null;
            })
            .addCase(deleteHighLight.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.highLights = state.highLights.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteHighLight.rejected, (state, action) => {
                state.adminLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, selectHighLight, clearSelectedHighLight } = adminHighLightSlice.actions;
export default adminHighLightSlice.reducer;
