import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { authApi } from "../../api/authApi.ts";
import { AUTH_TOKEN_KEY } from "../../api/axios.ts";
import type { User } from "../../types/user.ts";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../../types/auth.ts";
import type { ApiErrorResponse } from "../../types/api.ts";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initializationDone: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initializationDone: false,
};

function extractErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response) {
    const data = err.response.data as ApiErrorResponse;
    if (typeof data.message === "string") return data.message;
  }
  return fallback;
}

export const initializeAuth = createAsyncThunk<
  { user: User; token: string },
  void,
  { rejectValue: string }
>("auth/initialize", async (_, thunkAPI) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return thunkAPI.rejectWithValue("No token");
  try {
    const user = await authApi.getMe();
    return { user, token };
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return thunkAPI.rejectWithValue("Session expired");
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, thunkAPI) => {
  try {
    return await authApi.login(credentials);
  } catch (err) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err, "Login failed. Please try again."));
  }
});

export const registerUser = createAsyncThunk<
  void,
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (data, thunkAPI) => {
  try {
    await authApi.register(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractErrorMessage(err, "Registration failed. Please try again."),
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.initializationDone = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.initializationDone = true;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed.";
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Registration failed.";
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
