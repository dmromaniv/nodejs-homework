const mongoose = require("mongoose");

const app = require("./app");

mongoose
  .connect(process.env.DB_CONNECT_STRING)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch(() => {
    process.exit(1);
  });
