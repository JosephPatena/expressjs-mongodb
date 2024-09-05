require("dotenv").config();
const cors = require('cors');
const express = require("express");
const connectDb = require("./config/dbConnection");
const listEndpoints = require('express-list-endpoints');
const errorHandler = require("./middleware/errorHandler");

connectDb();
const app = express();


const port = process.env.PORT || 8000;

app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));

// Uncomment this line if you want to list all of the API routes available
// console.log(listEndpoints(app));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
