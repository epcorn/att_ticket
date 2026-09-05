import { useUserStore } from "../store/useUserStore";

export function checkRights(...rights) {
  const { user } = useUserStore.getState().user;
  if (!user || !user.rights) return false;

  return rights.some((right) => !!user.rights[right]);
}
