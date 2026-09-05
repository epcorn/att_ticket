import { useMutation } from "@tanstack/react-query";
import { loginContractApi } from "./useContract";
import { useUserStore } from "../store/useUserStore";

export const useLogin = () => {
  return useMutation({
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
