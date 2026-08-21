import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { logout, clearError } from "../store/slices/authSlice.ts";
import type { User } from "../types/user.ts";

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initializationDone: boolean;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error, initializationDone } = useAppSelector(
    (state) => state.auth,
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    initializationDone,
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
}
