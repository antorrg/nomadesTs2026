import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { productsPublicApi } from '../../publicApi/productsApi';
import type { IProduct, ProductsResponse, IItem } from '../../../types/product';

// Estado del slice
interface ProductState {
    // Productos públicos
    publicProducts: ProductsResponse[];
    publicItems: IItem[];
    selectedPublicProduct: IProduct | null;
    selectedPublicItem: IItem | null;
    publicLoading: boolean;

    // Estados compartidos
    error: string | null;
}

// Estado inicial
const initialState: ProductState = {
    publicProducts: [],
    publicItems: [],
    selectedPublicProduct: null,
    selectedPublicItem: null,
    publicLoading: false,

    error: null
};

// Thunks públicos
export const getPublicProducts = createAsyncThunk(
    'product/getPublicProducts',
    async (_, { rejectWithValue }) => {
        try {
            return await productsPublicApi.getAllPublic();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar productos');
        }
    }
);

export const getPublicProductById = createAsyncThunk(
    'product/getPublicProductById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await productsPublicApi.getPublicById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar producto');
        }
    }
);

export const getPublicItem = createAsyncThunk(
    'product/getPublicItem',
    async (id: number, { rejectWithValue }) => {
        try {
            return await productsPublicApi.getPublicItem(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar producto');
        }
    }
);


const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectProduct: (state, action) => {
            state.selectedPublicProduct = action.payload;
        },
        clearSelectedProduct: (state) => {
            state.selectedPublicProduct = null;
        },
        selectItem: (state, action) => {
            state.selectedPublicItem = action.payload;
        },
        clearSelectedItem: (state) => {
            state.selectedPublicItem = null;
        }
    },
    extraReducers: (builder) => {
        // Specific fulfilled cases (Data Updates)
        builder
            // Public Products
            .addCase(getPublicProducts.fulfilled, (state, action) => {
                state.publicProducts = action.payload;
            })
            .addCase(getPublicProductById.fulfilled, (state, action) => {
                state.selectedPublicProduct = action.payload;
            })
            .addCase(getPublicItem.fulfilled, (state, action) => {
                state.selectedPublicItem = action.payload;
            })
            // Matchers for Loading/Error/Fulfilled state management
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
                (action): action is AnyAction => action.type.endsWith('/rejected'),
                (state, action: AnyAction) => {
                    if (action.type.includes('Public')) {
                        state.publicLoading = false;
                    } 
                    if (action.payload) {
                        state.error = action.payload as string;
                    } else {
                        state.error = action.error?.message || 'Error desconocido';
                    }
                }
            )
            .addMatcher(
                (action): action is AnyAction => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    if (action.type.includes('Public')) {
                        state.publicLoading = false;
                    } 
                }
            );
    }
});

export const { clearError, selectProduct, clearSelectedProduct, selectItem, clearSelectedItem } = productSlice.actions;
export default productSlice.reducer;
