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

export const useImageUploade = () => {
  return useMutation({
    mutationKey: ["ticket"],
    mutationFn: async (imgs) => {
      const res = await fetch(`/api/upload`, {
        method: "POST",
        body: imgs,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Image not uploaded! try again");
      return await res.json();
    },
  });
};

export const useGetAllTickets = (filters = {}, options = {}) => {
  const {
    createdBy = "",
    contractNo = "",
    status = "",
    ticketNo = "",
  } = filters;
  return useQuery({
    queryKey: ["ticket", { createdBy, contractNo, status, ticketNo }],
    queryFn: async () => {
      const res = await fetch(
        `/api/ticket/getAllTickets?createdBy=${createdBy}&contractNo=${contractNo}&status=${status}&ticketNo=${ticketNo}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("failed to get contract");

      return await res.json();
    },
    ...options,
  });
};

export const useUpdateTicket = (options = {}) => {
  return useMutation({
    mutationKey: ["ticket"],
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`api/ticket/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("update failed", res);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
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
