import { useQuery } from "@tanstack/react-query";

export const loginContractApi = async () => {
  const res = await fetch("/api/contracts/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Contract login failed");
  return await res.json();
};
export const useGetContract = (options = {}) => {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const resp = await fetch(`/api/contracts/`);
      return await resp.json();
    },
    ...options,
  });
};
