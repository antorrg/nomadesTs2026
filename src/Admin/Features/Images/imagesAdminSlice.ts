import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { imagesApi } from '../../AdminApi/imagesApi';
import type { IImage, SaveImageInput } from '../../../types/image';

// Estado del slice (solo admin, no hay endpoints públicos)
interface ImagesState {
    images: IImage[];
    selectedImage: IImage | null;
    loading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: ImagesState = {
    images: [],
    selectedImage: null,
    loading: false,
    error: null
};

// Thunks (todos requieren autenticación)
export const getAllImages = createAsyncThunk(
    'images/getAllImages',
    async (_, { rejectWithValue }) => {
        try {
            return await imagesApi.getAll();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al cargar imágenes');
        }
    }
);

export const uploadImage = createAsyncThunk(
    'images/uploadImage',
    async (file: File, { rejectWithValue }) => {
        try {
            return await imagesApi.upload(file);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al subir imagen');
        }
    }
);

export const saveImage = createAsyncThunk(
    'images/saveImage',
    async (data: SaveImageInput, { rejectWithValue }) => {
        try {
            return await imagesApi.save(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al guardar imagen');
        }
    }
);

export const deleteImage = createAsyncThunk(
    'images/deleteImage',
    async (id: number, { rejectWithValue }) => {
        try {
            await imagesApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar imagen');
        }
    }
);

const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectImage: (state, action) => {
            state.selectedImage = action.payload;
        },
        clearSelectedImage: (state) => {
            state.selectedImage = null;
        }
    },
    extraReducers: (builder) => {
        // Get all images
        builder
            .addCase(getAllImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllImages.fulfilled, (state, action) => {
                state.loading = false;
                state.images = action.payload;
            })
            .addCase(getAllImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Upload image
        builder
            .addCase(uploadImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadImage.fulfilled, (state) => {
                state.loading = false;
                // Upload solo retorna URL, no agrega a la lista
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Save image
        builder
            .addCase(saveImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveImage.fulfilled, (state, action) => {
                state.loading = false;
                state.images.push(action.payload);
            })
            .addCase(saveImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete image
        builder
            .addCase(deleteImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteImage.fulfilled, (state, action) => {
                state.loading = false;
                state.images = state.images.filter(img => img.id !== action.payload);
            })
            .addCase(deleteImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, selectImage, clearSelectedImage } = imagesSlice.actions;
export default imagesSlice.reducer;
