export const apiPaths = {
  root: "https://localhost:7168/api",
  endpoints:{
    ships: {
      root: "ship"
    },
    users: {
      root: "user",
      rolesString: "roles-string",
      roles: "roles",
      register: "register",
      login: "login"
    },
    travels: {
      root: "travel"
    },
    tickets: {
      root: "ticket",
      getByUserId: "user",
      getByRefernce: "reference",
      redeemTicket: "redeem"
    }
  }
}
