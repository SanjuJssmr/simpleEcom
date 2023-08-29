const express = require("express");
const dotenv = require("dotenv");
const { DBInfo } = require("./config/db.js");
const { default: mongoose } = require("mongoose");
const userRouter = require("./routes/userRoute.js");
const prodcutRouter = require("./routes/productRoutes.js");
const salesRoutes = require("./routes/salesRoutes.js");
const cors = require('cors')
const cron = require("node-cron");
const adminRouter = require("./routes/adminRoute.js");
const { track } = require("./middlewares/middlewares.js");

const app = express();
dotenv.config();
mongoose.connect(DBInfo.MONGO_URL).then(console.log("mongo connected"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin:"*"}))
// app.use(track)
app.use("/users/", userRouter, express.static("./uploads"));
app.use("/products", prodcutRouter);
app.use("/sales", salesRoutes);
app.use('/admin',adminRouter)

cron.schedule("*/2 * * * * *", function () {
let otp = generateOTP()
console.log(otp);
});


app.listen(5000, () => {
  console.log("node is running");
});
