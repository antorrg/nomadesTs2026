import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { aboutPublicApi } from '../../publicApi/aboutApi';
import type { IAbout } from '../../../types/about';

interface AboutState {
    publicAbout: IAbout[];
    selectedPublicAbout: IAbout | null;
    publicLoading: boolean;
    error: string | null;
}

const initialState: AboutState = {
    publicAbout: [],
    selectedPublicAbout: null,
    publicLoading: false,
    error: null
};

export const getPublicAbout = createAsyncThunk(
    'about/getPublicAbout',
    async (_, { rejectWithValue }) => {
        try {
            return await aboutPublicApi.getAllPublic();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Error al cargar información sobre nosotros');
        }
    }
);

export const getPublicAboutById = createAsyncThunk(
    'about/getPublicAboutById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await aboutPublicApi.getPublicById(id);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Error al cargar información sobre nosotros');
        }
    }
);

const aboutSlice = createSlice({
    name: 'about',
    initialState,
    reducers: {
        selectAbout: (state, action: PayloadAction<IAbout | null>) => {
            state.selectedPublicAbout = action.payload;
        },
        clearSelectedAbout: (state) => {
            state.selectedPublicAbout = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPublicAbout.pending, (state) => {
                state.publicLoading = true;
                state.error = null;
            })
            .addCase(getPublicAbout.fulfilled, (state, action) => {
                state.publicLoading = false;
                state.publicAbout = action.payload;
            })
            .addCase(getPublicAbout.rejected, (state, action) => {
                state.publicLoading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(getPublicAboutById.pending, (state) => {
                state.publicLoading = true;
                state.error = null;
            })
            .addCase(getPublicAboutById.fulfilled, (state, action) => {
                state.publicLoading = false;
                state.selectedPublicAbout = action.payload;
            })
            .addCase(getPublicAboutById.rejected, (state, action) => {
                state.publicLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, selectAbout, clearSelectedAbout } = aboutSlice.actions;
export default aboutSlice.reducer;
