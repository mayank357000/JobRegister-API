require("dotenv").config();
require("express-async-errors");

const path = require("path");
// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set('trust proxy',1);//for heroku deployment settings

app.use(express.static(path.resolve(__dirname, "./client/build")));//ye react production build ka 
//project daal diya express.static middleware mai
//ye uske saare routes khud hi bnakr handle kr lega
//react router se bhi compatible

app.use(express.json());
app.use(helmet());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

//serve index.html for different routes other than mentioned
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));//agr koi ulte seedhe url pr
  //after our localhost:5000/angupangu
});
//frontend ka khudka bhi router hai
//jaise hi localhost:5000/ krega na

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
