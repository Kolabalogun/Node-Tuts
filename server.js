require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const app = express();

const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const connectDB = require("./config/dbConn");
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT || 3500;

// Connect to MongoDB

connectDB();

// Handle credentials check - before CORS

app.use(credentials);

app.use(cors(corsOptions));

// built in middleware to hadle encoded data
// which means form data
app.use(express.urlencoded({ extended: false }));

// built in middlesware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files e.g to aplly css to  views
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

// for all routes
// app.use("/", require("./routes/root"));

// take routes from the router (subdirectories in the views)
app.use("/subdir", require("./routes/subdir"));

// routess for register
app.use("/register", require("./routes/register"));

// routess to sign in
app.use("/auth", require("./routes/auth"));

// routess to refresh tokens
app.use("/refresh", require("./routes/refresh"));

// routess to logout
app.use("/logout", require("./routes/logout"));

// verifyJWT
app.use(verifyJWT);
// routess for employees
app.use("/employees", require("./routes/api/employees"));

// check if connection is established to mongoose

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
});

// app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
