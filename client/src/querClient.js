import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUserStore } from "./store/useUserStore";

let isLoggingOut = false;

const handleUnauthorizedLogout = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  toast.info("Session expired. Please log in again.");

  // 2. Reset in-memory Zustand store state
  useUserStore.getState().logoutUser();

  // Allow subsequent logouts after navigation completes
  setTimeout(() => {
    isLoggingOut = false;
  }, 1000);
};

const isUnauthorizedError = (error) => {
  return error?.message === "401" || error?.status === 401;
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorizedLogout();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorizedLogout();
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (isUnauthorizedError(error)) return false;
        return failureCount < 3;
      },
    },
  },
});
