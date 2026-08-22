import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { imageApi } from "../../api/imageApi.ts";
import type { Image } from "../../types/image.ts";
import type { ApiErrorResponse } from "../../types/api.ts";

interface ImageState {
  images: Image[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  isLoading: false,
  error: null,
};

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response) {
    const data = err.response.data as ApiErrorResponse;
    if (typeof data.message === "string") return data.message;
  }
  return fallback;
}

export const fetchImages = createAsyncThunk<Image[], void, { rejectValue: string }>(
  "image/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await imageApi.getImages();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        extractErrorMessage(err, "Failed to load images. Please try again."),
      );
    }
  },
);

export const uploadImages = createAsyncThunk<Image[], FormData, { rejectValue: string }>(
  "image/upload",
  async (formData, thunkAPI) => {
    try {
      return await imageApi.upload(formData);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        extractErrorMessage(err, "Upload failed. Please check the image sizes and format."),
      );
    }
  },
);

export const updateImage = createAsyncThunk<
  Image,
  { id: string; formData: FormData },
  { rejectValue: string }
>("image/update", async ({ id, formData }, thunkAPI) => {
  try {
    return await imageApi.update(id, formData);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Update failed. Please try again."),
    );
  }
});

export const deleteImage = createAsyncThunk<string, string, { rejectValue: string }>(
  "image/delete",
  async (id, thunkAPI) => {
    try {
      await imageApi.delete(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        extractErrorMessage(err, "Failed to delete image. Please try again."),
      );
    }
  },
);

export const saveImageOrder = createAsyncThunk<Image[], string[], { rejectValue: string }>(
  "image/reorder",
  async (imageIds, thunkAPI) => {
    try {
      await imageApi.reorder(imageIds);
      // Fetch refreshed and ordered images from S3 to ensure full sync
      return await imageApi.getImages();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        extractErrorMessage(err, "Failed to save reordered positions. Please try again."),
      );
    }
  },
);

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setLocalImagesOrder: (state, action: PayloadAction<Image[]>) => {
      state.images = action.payload;
    },
    clearImageError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.images = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load images.";
      });

    builder
      .addCase(uploadImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.images = [...state.images, ...action.payload];
        state.isLoading = false;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Upload failed.";
      });

    builder
      .addCase(updateImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.images = state.images.map((img) =>
          img.id === action.payload.id ? action.payload : img,
        );
        state.isLoading = false;
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Update failed.";
      });

    builder
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter((img) => img.id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Delete failed.";
      });

    builder
      .addCase(saveImageOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveImageOrder.fulfilled, (state, action) => {
        state.images = action.payload;
        state.isLoading = false;
      })
      .addCase(saveImageOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to save order.";
      });
  },
});

export const { setLocalImagesOrder, clearImageError } = imageSlice.actions;
export default imageSlice.reducer;
