import { useUserStore } from "../store/useUserStore";

export function checkRights(...rights) {
  const { user } = useUserStore.getState().user;
  if (!user || !user.rights) return false;

  return rights.some((right) => !!user.rights[right]);
}

export function formatDateTime(data) {
  if (!data) return ""; // Guard clause against null/undefined data

  const date = new Date(data);

  // Returns the formatted string directly
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true, // Forces 12-hour format with am/pm
    dateStyle: "short", // Options: "short", "medium", "long", "full"
    timeStyle: "short", // Options: "short", "medium", "long"
  });
}
