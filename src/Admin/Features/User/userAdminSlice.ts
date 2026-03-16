import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { userApi } from '../../AdminApi/userApi';
import type { IUser } from '../../../types/user';

// Estado del slice (solo admin, no hay endpoints públicos)
interface UserState {
    users: IUser[];
    selectedUser: IUser | null;
    totalUsers: number;
    loading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: UserState = {
    users: [],
    selectedUser: null,
    totalUsers: 0,
    loading: false,
    error: null
};

// Thunks (todos requieren autenticación)
export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            return await userApi.getAll();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar usuarios');
        }
    }
);

export const getUsersWithPages = createAsyncThunk(
    'user/getUsersWithPages',
    async ({ page, limit }: { page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            return await userApi.getAllWithPages(page, limit);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar usuarios');
        }
    }
);

export const getUserById = createAsyncThunk(
    'user/getUserById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await userApi.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar usuario');
        }
    }
);



const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        }
    },
    extraReducers: (builder) => {
        // Specific fulfilled cases (Data Updates)
        builder
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(getUsersWithPages.fulfilled, (state, action) => {
                state.users = action.payload.users;
                state.totalUsers = action.payload.total;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            })

            // Matchers for Loading/Error/Fulfilled state management
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action): action is AnyAction => action.type.endsWith('/rejected'),
                (state, action: AnyAction) => {
                    state.loading = false;
                    if (action.payload) {
                        state.error = action.payload as string;
                    } else {
                        state.error = action.error?.message || 'Error desconocido';
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            );
    }
});

export const { clearError, selectUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
