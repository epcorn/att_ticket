import { create } from "zustand";

const formatAddress = (...parts) => {
  return parts
    .map((part) => (part ? String(part).trim() : ""))
    .filter(Boolean)
    .join(" ");
};

export const useContractStore = create((set) => ({
  filteredContract: {},
  billToName: "",
  billToAddress: "",
  shipToName: "",
  billToEmail: [],
  shipToEmail: [],
  shipToAddress: "",
  filterError: null,
  status: "initial",

  setFilteredContract: async (contracts, number) => {
    const filtered = contracts.result.find((c) => c._id === number);
    if (!filtered)
      return set({
        filterError: "contract Not found",
        status: "error",
        filteredContract: {},
        billToName: "",
        billToAddress: "",
        shipToName: "",
        shipToAddress: "",
        billToEmail: [],
        shipToEmail: [],
      });
    const {
      a1 = "",
      a2 = "",
      a3 = "",
      a4 = "",
      a5 = "",
      city = "",
      name = "",
      pincode = "",
      prefix = "",
      kci = [],
    } = filtered.billToAddress || {};

    const {
      a1: s1 = "",
      a2: s2 = "",
      a3: s3 = "",
      a4: s4 = "",
      a5: s5 = "",
      city: sCity = "",
      projectName = "",
      pincode: sPincode = "",
      kci: sKci = [],
    } = filtered.shipToAddress || {};

    set({
      filterError: null,
      status: "success",
      filteredContract: filtered,
      billToAddress: formatAddress(a1, a2, a3, a4, a5, city, pincode),
      billToName: formatAddress(prefix, name),
      shipToAddress: formatAddress(s1, s2, s3, s4, s5, sCity, sPincode),
      shipToName: projectName.trim(),
      billToEmail: kci?.map((k) => k?.email?.trim()).filter(Boolean),
      shipToEmail: sKci?.map((k) => k?.email?.trim()).filter(Boolean),
    });
  },
  resetStore: () =>
    set({
      filteredContract: {},
      billToName: "",
      billToAddress: "",
      shipToName: "",
      shipToAddress: "",
      filterError: null,
      status: "initial",
      billToEmail: [],
      shipToEmail: [],
    }),
}));
