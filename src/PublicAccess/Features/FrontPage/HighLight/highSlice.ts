import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { highPublicApi } from '../../../publicApi/highApi';
import type { IHightLight } from '../../../../types/hightLight';

// Estado del slice
interface HighState {
    publicHigh: IHightLight[];
    selectedPublicHigh: IHightLight | null;
    publicLoading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: HighState = {
    publicHigh: [],
    selectedPublicHigh: null,
    publicLoading: false,
    error: null
};

// Thunks públicos
export const getPublicHigh = createAsyncThunk(
    'work/getPublicHigh',
    async (_, { rejectWithValue }) => {
        try {
             return await highPublicApi.getAllPublic();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Error al cargar registros');
        }
    }
);
// Thunks públicos
export const getPublicHighById = createAsyncThunk(
    'work/getPublicHighById',
    async (id:number, { rejectWithValue }) => {
        try {
             return await highPublicApi.getPublicById(id);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Error al cargar registro');
        }
    }
);


const highSlice = createSlice({
    name: 'high',
    initialState,
    reducers: {
  
        selectHigh: (state, action: PayloadAction<IHightLight | null>) => {
            state.selectedPublicHigh = action.payload;
        },
        clearSelectedHigh: (state) => {
            state.selectedPublicHigh = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get public works
        builder
            .addCase(getPublicHigh.pending, (state) => {
                state.publicLoading = true;
                state.error = null;
            })
            .addCase(getPublicHigh.fulfilled, (state, action) => {
                state.publicLoading = false;
                state.publicHigh = action.payload;
            })
            .addCase(getPublicHigh.rejected, (state, action) => {
                state.publicLoading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(getPublicHighById.pending, (state) => {
                state.publicLoading = true;
                state.error = null;
            })
            .addCase(getPublicHighById.fulfilled, (state, action) => {
                state.publicLoading = false;
                state.selectedPublicHigh = action.payload;
            })
            .addCase(getPublicHighById.rejected, (state, action) => {
                state.publicLoading = false;
                state.error = action.payload as string;
            });

    }
});

export const { clearError, selectHigh, clearSelectedHigh } = highSlice.actions;
export default highSlice.reducer;
