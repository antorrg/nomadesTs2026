import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { landingApi } from '../../AdminApi/landingApi';
import type { ILanding, LandingResults } from '../../../types/landing';

// Estado del slice
interface HomeState {

    // Estados admin
    landing: LandingResults[];
    selectedLanding: ILanding | null;
    adminLoading: boolean;

    // Error compartido
    error: string | null;
}

// Estado inicial
const initialState: HomeState = {
    landing: [],
    selectedLanding: null,
    adminLoading: false,

    error: null
};


// Thunks autenticados (admin)
export const getAllLanding = createAsyncThunk(
    'home/getAllLanding',
    async (_, { rejectWithValue }) => {
        try {
            return await landingApi.getAll();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar landing');
        }
    }
);

export const getLandingById = createAsyncThunk(
    'home/getLandingById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await landingApi.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar landing');
        }
    }
);


const homeAdminSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectLanding: (state, action) => {
            state.selectedLanding = action.payload;
        },
        clearSelectedLanding: (state) => {
            state.selectedLanding = null;
        }
    },
    extraReducers: (builder) => {
        // Specific fulfilled cases (Data Updates)
        builder
            // Admin Landing
            .addCase(getAllLanding.fulfilled, (state, action) => {
                state.landing = action.payload;
            })
            .addCase(getLandingById.fulfilled, (state, action) => {
                state.selectedLanding = action.payload;
            })
    }
});

export const { clearError, selectLanding, clearSelectedLanding } = homeAdminSlice.actions;
export default homeAdminSlice.reducer;