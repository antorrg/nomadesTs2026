import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { userApi } from '../../AdminApi/userApi';
import { authApi } from '../../../api/authApi';
import type { IUser } from '../../../types/user';

// Estado del slice (solo admin, no hay endpoints públicos)
interface UserState {
    users: IUser[];
    selectedUser: IUser | null;
    /** Usuario de la sesión actual (navbar/perfil propio). Nunca se pisa con otros usuarios. */
    sessionUser: IUser | null;
    totalUsers: number;
    loading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: UserState = {
    users: [],
    selectedUser: null,
    sessionUser: null,
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

// Siempre obtiene el usuario de la sesión: el id se pide a auth (/me), no se recibe por argumento
export const getSessionUser = createAsyncThunk(
    'user/getSessionUser',
    async (_: void, { rejectWithValue }) => {
        try {
            const me = await authApi.me();
            return await userApi.getById(String(me.id));
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar usuario de sesión');
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
        },
        clearSessionUser: (state) => {
            state.sessionUser = null;
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
            .addCase(getSessionUser.fulfilled, (state, action) => {
                state.sessionUser = action.payload;
            })

            // Matchers for Loading/Error/Fulfilled state management
            .addMatcher(
                (action) => action.type.startsWith('user/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action): action is AnyAction => action.type.startsWith('user/') && action.type.endsWith('/rejected'),
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
                (action) => action.type.startsWith('user/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            );
    }
});

export const { clearError, selectUser, clearSelectedUser, clearSessionUser } = userSlice.actions;
export default userSlice.reducer;
