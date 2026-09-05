import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../querClient";

export const useCreateTicket = () => {
  return useMutation({
    mutationKey: ["ticket"],
    mutationFn: async (payload) => {
      const res = await fetch(`/api/ticket/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed to create ticket");

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
  });
};

export const useGetAllTickets = (options = {}) => {
  return useQuery({
    queryKey: ["ticket"],
    queryFn: async () => {
      const res = await fetch(`/api/ticket/getAllTickets`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("failed to get contract");

      return await res.json();
    },
    ...options,
  });
};

export const useGetAllJobs = (options = {}) => {
  return useQuery({
    queryKey: ["ticket"],
    queryFn: async () => {
      const res = await fetch(`api/ticket/allJobs`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("failed to get all jobs");

      return await res.json();
    },
    ...options,
  });
};
