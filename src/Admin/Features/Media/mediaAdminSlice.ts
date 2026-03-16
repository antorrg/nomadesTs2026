import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { mediaApi } from '../../AdminApi/mediaApi';
import type { IMedia } from '../../../types/media';

// Estado del slice
interface MediaState {
    media: IMedia[];
    selectedMedia: IMedia | null;
    adminLoading: boolean;

    error: string | null;
}

// Estado inicial
const initialState: MediaState = {
    media: [],
    selectedMedia: null,
    adminLoading: false,

    error: null
};


// Thunks autenticados
export const getAllMedia = createAsyncThunk(
    'media/getAllMedia',
    async (_, { rejectWithValue }) => {
        try {
            return await mediaApi.getAll();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar media');
        }
    }
);



const adminMediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectMedia: (state, action) => {
            state.selectedMedia = action.payload;
        },
        clearSelectedMedia: (state) => {
            state.selectedMedia = null;
        }
    },
    extraReducers: (builder) => {
        // Specific fulfilled cases (Data Updates)
        builder
            // Admin Media
            .addCase(getAllMedia.fulfilled, (state, action) => {
                state.media = action.payload;
            })

            // Matchers
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.error = null;
                        state.adminLoading = true;
                    
                }
            )
            .addMatcher(
                (action): action is AnyAction => action.type.endsWith('/rejected'),
                (state, action: AnyAction) => {
                        state.adminLoading = false;
                    if (action.payload) {
                        state.error = action.payload as string;
                    } else {
                        state.error = action.error?.message || 'Error desconocido';
                    }
                }
            )
            .addMatcher(
                (action): action is AnyAction => action.type.endsWith('/fulfilled'),
                (state) => {
                        state.adminLoading = false;
                    
                }
            );
    }
});

export const { clearError, selectMedia, clearSelectedMedia } = adminMediaSlice.actions;
export default adminMediaSlice.reducer;
