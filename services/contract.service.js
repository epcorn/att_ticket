export const contractService = {
  token: null,
  login: async () => {
    const resp = await fetch(
      "https://att-quotation.onrender.com/api/v1/user/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: process.env.att_user,
          password: process.env.att_pass,
        }),
      },
    );
    if (!resp.ok) {
      const error = new Error("Login failed to att");
      error.status = resp.status;
      throw error;
    }
    const cookies = resp.headers.getSetCookie();
    const targetCookie = cookies.find((c) => c.startsWith("access_token="));
    if (targetCookie) {
      contractService.token = targetCookie.split(";")[0];
    }
    console.log(contractService.token);
    const data = await resp.json();
    return data;
  },
  getContracts: async () => {
    if (!contractService.token) {
      await contractService.login();
    }
    const resp = await fetch(
      `https://att-quotation.onrender.com/api/v1/contract/getContracts?limit=500`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: contractService.token,
        },
      },
    );
    const data = await resp.json();
    return data;
  },
};
