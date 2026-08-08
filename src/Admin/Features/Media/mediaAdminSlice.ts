import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { mediaApi } from '../../AdminApi/mediaApi';
import type { IMedia } from '../../../types/media';
import { type MediaTabVisibilityConfig, DEFAULT_TAB_CONFIG } from '../../../types/mediaConfig';

// Estado del slice
interface MediaState {
    media: IMedia[];
    selectedMedia: IMedia | null;
    adminLoading: boolean;
    tabConfig: MediaTabVisibilityConfig;
    error: string | null;
}

// Estado inicial
const initialState: MediaState = {
    media: [],
    selectedMedia: null,
    adminLoading: false,
    tabConfig: DEFAULT_TAB_CONFIG,
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

export const getMediaById = createAsyncThunk(
    'media/getMediaById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await mediaApi.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar media');
        }
    }
);

export const updateMediaConfigThunk = createAsyncThunk(
    'media/updateConfig',
    async (data: Partial<MediaTabVisibilityConfig>, { rejectWithValue }) => {
        try {
            return await mediaApi.updateConfig(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar configuración');
        }
    }
);

const adminMediaSlice = createSlice({
    name: 'adminMedia',
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
        },
        updateAdminTabConfig: (state, action: PayloadAction<MediaTabVisibilityConfig>) => {
            state.tabConfig = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllMedia.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.media = action.payload.filter((item: any) => item.type !== 'config');
                    const configItem = action.payload.find((item: any) => item.type === 'config');
                    if (configItem) {
                        state.tabConfig = {
                            showFacebook: configItem.showFacebook ?? true,
                            showInstagram: configItem.showInstagram ?? true,
                            showYouTube: configItem.showYouTube ?? true
                        };
                    }
                } else {
                    state.media = action.payload;
                }
            })
            .addCase(getMediaById.fulfilled, (state, action) => {
                state.selectedMedia = action.payload;
            })
            .addCase(updateMediaConfigThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    state.tabConfig = {
                        showFacebook: action.payload.showFacebook ?? state.tabConfig.showFacebook,
                        showInstagram: action.payload.showInstagram ?? state.tabConfig.showInstagram,
                        showYouTube: action.payload.showYouTube ?? state.tabConfig.showYouTube,
                    };
                }
            })
            .addMatcher(
                (action) => action.type.startsWith('media/') && action.type.endsWith('/pending'),
                (state) => {
                    state.error = null;
                    state.adminLoading = true;
                }
            )
            .addMatcher(
                (action): action is AnyAction => action.type.startsWith('media/') && action.type.endsWith('/rejected'),
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
                (action): action is AnyAction => action.type.startsWith('media/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.adminLoading = false;
                }
            );
    }
});

export const { clearError, selectMedia, clearSelectedMedia, updateAdminTabConfig } = adminMediaSlice.actions;
export default adminMediaSlice.reducer;
