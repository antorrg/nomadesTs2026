import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aboutAdminApi } from '../../AdminApi/aboutApi';
import type { IAbout } from '../../../types/about';

interface AboutAdminState {
    about: IAbout[];
    selectedAbout: IAbout | null;
    adminLoading: boolean;
    error: string | null;
}

const initialState: AboutAdminState = {
    about: [],
    selectedAbout: null,
    adminLoading: false,
    error: null
};

export const getAllAbout = createAsyncThunk(
    'adminAbout/getAllAbout',
    async (_, { rejectWithValue }) => {
        try {
            return await aboutAdminApi.getAll();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Error al cargar datos de about');
        }
    }
);

export const getAboutById = createAsyncThunk(
    'adminAbout/getAboutById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await aboutAdminApi.getById(id);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            return rejectWithValue(err.response?.data?.message || 'Error al cargar item de about');
        }
    }
);

const aboutAdminSlice = createSlice({
    name: 'adminAbout',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectAbout: (state, action) => {
            state.selectedAbout = action.payload;
        },
        clearSelectedAbout: (state) => {
            state.selectedAbout = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAbout.pending, (state) => {
                state.adminLoading = true;
            })
            .addCase(getAllAbout.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.about = action.payload;
            })
            .addCase(getAllAbout.rejected, (state, action) => {
                state.adminLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getAboutById.pending, (state) => {
                state.adminLoading = true;
            })
            .addCase(getAboutById.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.selectedAbout = action.payload;
            })
            .addCase(getAboutById.rejected, (state, action) => {
                state.adminLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, selectAbout, clearSelectedAbout } = aboutAdminSlice.actions;
export default aboutAdminSlice.reducer;
