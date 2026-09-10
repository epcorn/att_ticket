import { useMutation, useQuery } from "@tanstack/react-query";
import { loginContractApi } from "./useContract";
import { useUserStore } from "../store/useUserStore";
import { queryClient } from "../querClient";

export const useLogin = () => {
  return useMutation({
    mutationKey: ["users"],
    mutationFn: async (creds) => {
      const res = await fetch(`/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      if (!res.ok) throw new Error("response not ok");
      return await res.json();
    },
    onSuccess: async (data) => {
      useUserStore.getState().setUser(data);
      try {
        await loginContractApi();
      } catch (error) {
        console.error("contract login error", error);
      }
    },
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationKey: ["users", "create"],
    mutationFn: async (creds) => {
      const res = await fetch(`/api/user/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      if (!res.ok) throw new Error("response not ok");
      return await res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["users", "list"] }),
  });
};

export const useGetUsers = ({ options = {} }) => {
  return useQuery({
    queryKey: ["users", "list"],
    queryFn: async () => {
      const res = await fetch(`/api/user`, { credentials: "include" });
      if (!res.ok) throw new Error("response not ok");
      return await res.json();
    },
    ...options,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationKey: ["users", "update"],
    mutationFn: async ({ creds, id }) => {
      const res = await fetch(`/api/user/update/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creds),
      });
      if (!res.ok) throw new Error("response not ok");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
};
