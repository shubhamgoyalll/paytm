const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

//Works the same as express.json
// app.use(bodyParser.json());
app.use(cors);
app.use(express.json());

// const bodyParser = require("body-parser");
const rootRouter = require("./routes/index");

app.use("/api/v1", rootRouter);

app.listen(port, () => {
  console.log("Listening on port", port);
});
