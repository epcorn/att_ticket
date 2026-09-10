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
      if (res.status === 401) throw new Error("401");
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
      if (res.status === 401) throw new Error("401");
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
    startIndex = 0,
    limit = 20,
  } = filters;

  return useQuery({
    // Keep parameters in the queryKey so React Query refetches when they change
    queryKey: [
      "ticket",
      { createdBy, contractNo, status, ticketNo, startIndex, limit },
    ],
    queryFn: async () => {
      // Build a clean URL query string
      const queryParams = new URLSearchParams({
        createdBy,
        contractNo,
        status,
        ticketNo,
        startIndex,
        limit,
      }).toString();

      const res = await fetch(`/api/ticket/getAllTickets?${queryParams}`, {
        method: "GET", // Back to standard GET
        credentials: "include",
      });

      if (res.status === 401) throw new Error("401");
      if (!res.ok) throw new Error("failed to get contracts");

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
      if (res.status === 401) throw new Error("401");
      if (!res.ok) throw new Error(`update failed: ${res.message}`);
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
    queryKey: ["ticket",'allJobs'],
    queryFn: async () => {
      const res = await fetch(`api/ticket/allJobs`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 401) throw new Error("401");
      if (!res.ok) throw new Error("failed to get all jobs");

      return await res.json();
    },
    ...options,
  });
};

export const useGetRaisedCounts = (options = {}) => {
  return useQuery({
    queryKey: ["ticket",'raisedCounts'],
    queryFn: async () => {
      const res = await fetch(`api/ticket/raisedCounts`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 401) throw new Error("401");
      if (!res.ok) throw new Error("failed to get all jobs");

      return await res.json();
    },
    ...options,
  });
};
