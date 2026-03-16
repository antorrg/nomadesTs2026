import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type Action } from '@reduxjs/toolkit';
import { mediaPublicApi } from '../../publicApi/mediaApi';
import type { IMedia } from '../../../types/media';

// Estado del slice
interface MediaState {
    publicMedia: IMedia[];
    selectedPublicMedia: IMedia | null;
    publicLoading: boolean;

    error: string | null;
}

// Estado inicial
const initialState: MediaState = {
    publicMedia: [],
    selectedPublicMedia: null,
    publicLoading: false,

    error: null
};

// Thunks públicos
export const getPublicMedia = createAsyncThunk(
    'media/getPublicMedia',
    async (_, { rejectWithValue }) => {
        try {
            return await mediaPublicApi.getAllPublic();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar videos');
        }
    }
);

export const getPublicMediaById = createAsyncThunk(
    'media/getPublicMediaById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await mediaPublicApi.getPublicById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar videos');
        }
    }
);



const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectMedia: (state, action) => {
            state.selectedPublicMedia = action.payload;
        },
        clearSelectedMedia: (state) => {
            state.selectedPublicMedia = null;
        }
    },
    extraReducers: (builder) => {
        // Specific fulfilled cases (Data Updates)
        builder
            // Public Media
            .addCase(getPublicMedia.fulfilled, (state, action) => {
                state.publicMedia = action.payload;
            })
            .addCase(getPublicMediaById.fulfilled, (state, action) => {
                state.selectedPublicMedia = action.payload;
            })
            // Admin Media

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
                (action): action is Action => action.type.endsWith('/rejected'),
                (state, action: Action) => {
                    if (action.type.includes('Public')) {
                        state.publicLoading = false;
                    }
                    if (action.payload) {
                        state.error = action.payload as string;
                    } 
                }
            )
            .addMatcher(
                (action): action is Action => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    if (action.type.includes('Public')) {
                        state.publicLoading = false;
                    }
                }
            );
    }
});

export const { clearError, selectMedia, clearSelectedMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
