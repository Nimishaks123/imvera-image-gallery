import { useEffect } from "react";
import { useAppDispatch } from "./store/store.ts";
import { initializeAuth } from "./store/slices/authSlice.ts";
import { AppRouter } from "./routes/AppRouter.tsx";

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initializeAuth());
  }, [dispatch]);

  return <AppRouter />;
}
