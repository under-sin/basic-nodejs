const UserController = require("./controller/UserController");

module.exports = [
  {
    endpoint: "/users",
    method: "GET",
    handler: UserController.listUsers,
  },
  {
    endpoint: "/products",
    method: "GET",
    handler: UserController.listUsers,
  },
];
