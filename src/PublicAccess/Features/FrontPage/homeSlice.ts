import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { landingPublicApi } from '../../publicApi/landingApi';
import type { ILanding, LandingResults } from '../../../types/landing';

// Estado del slice
interface HomeState {
    // Estados públicos
    publicLanding: LandingResults[];
    selectedPublicLanding: ILanding | null;
    publicLoading: boolean;

    // Error compartido
    error: string | null;
}

// Estado inicial
const initialState: HomeState = {
    publicLanding: [],
    selectedPublicLanding: null,
    publicLoading: false,
    error: null
};

// Thunks públicos
export const getPublicLanding = createAsyncThunk(
    'home/getPublicLanding',
    async (_, { rejectWithValue }) => {
        try {
            return await landingPublicApi.getAllPublic();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar la informacion');
        }
    }
);

export const getPublicLandingById = createAsyncThunk(
    'home/getPublicLandingById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await landingPublicApi.getPublicById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar la informacion');
        }
    }
);


const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectLanding: (state, action) => {
            state.selectedPublicLanding = action.payload;
        },
        clearSelectedLanding: (state) => {
            state.selectedPublicLanding = null;
        }
    },
    extraReducers: (builder) => {
        // Specific fulfilled cases (Data Updates)
        builder
            // Public Landing
            .addCase(getPublicLanding.fulfilled, (state, action) => {
                state.publicLanding = action.payload;
                state.publicLoading = false
            })
            .addCase(getPublicLandingById.fulfilled, (state, action) => {
                state.selectedPublicLanding = action.payload;
            })

            // Matchers
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state, action) => {
                    state.error = null;
                    if (action.type.includes('Public')) {
                        state.publicLoading = true;
                    } 
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    if (action.type.includes('Public')) {
                        state.publicLoading = false;
                    }
                }
            );
    }
});

export const { clearError, selectLanding, clearSelectedLanding } = homeSlice.actions;
export default homeSlice.reducer;