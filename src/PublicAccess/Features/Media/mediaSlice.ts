import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Action } from '@reduxjs/toolkit';
import { mediaPublicApi } from '../../publicApi/mediaApi';
import type { IMedia } from '../../../types/media';
import { type MediaTabVisibilityConfig, DEFAULT_TAB_CONFIG } from '../../../types/mediaConfig';

// Estado del slice
interface MediaState {
    publicMedia: IMedia[];
    selectedPublicMedia: IMedia | null;
    publicLoading: boolean;
    tabConfig: MediaTabVisibilityConfig;
    error: string | null;
}

// Estado inicial
const initialState: MediaState = {
    publicMedia: [],
    selectedPublicMedia: null,
    publicLoading: false,
    tabConfig: DEFAULT_TAB_CONFIG,
    error: null
};

// Thunks públicos
export const getPublicMedia = createAsyncThunk(
    'media/getPublicMedia',
    async (_, { rejectWithValue }) => {
        try {
            return await mediaPublicApi.getAllPublic();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Error al cargar videos');
        }
    }
);

export const getPublicMediaById = createAsyncThunk(
    'media/getPublicMediaById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await mediaPublicApi.getPublicById(id);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Error al cargar videos');
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
        selectMedia: (state, action: PayloadAction<IMedia | null>) => {
            state.selectedPublicMedia = action.payload;
        },
        clearSelectedMedia: (state) => {
            state.selectedPublicMedia = null;
        },
        updateTabConfig: (state, action: PayloadAction<MediaTabVisibilityConfig>) => {
            state.tabConfig = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPublicMedia.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.publicMedia = action.payload.filter((item: IMedia) => item.type !== 'config');
                    const configItem = action.payload.find((item: IMedia) => item.type === 'config');
                    if (configItem) {
                        state.tabConfig = {
                            showFacebook: configItem.showFacebook ?? true,
                            showInstagram: configItem.showInstagram ?? true,
                            showYouTube: configItem.showYouTube ?? true
                        };
                    }
                } else {
                    state.publicMedia = action.payload;
                }
            })
            .addCase(getPublicMediaById.fulfilled, (state, action) => {
                state.selectedPublicMedia = action.payload;
            })
            .addMatcher(
                (action) => action.type.startsWith('media/') && action.type.endsWith('/pending'),
                (state, action) => {
                    state.error = null;
                    if (action.type.includes('Public')) {
                        state.publicLoading = true;
                    }
                }
            )
            .addMatcher(
                (action): action is Action => action.type.startsWith('media/') && action.type.endsWith('/rejected'),
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
                (action): action is Action => action.type.startsWith('media/') && action.type.endsWith('/fulfilled'),
                (state, action) => {
                    if (action.type.includes('Public')) {
                        state.publicLoading = false;
                    }
                }
            );
    }
});

export const { clearError, selectMedia, clearSelectedMedia, updateTabConfig } = mediaSlice.actions;
export default mediaSlice.reducer;
