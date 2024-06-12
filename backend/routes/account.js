const express = require("express");

const router = express.Router();

const z = require("zod");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.status(200).json({
    balance: account.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  //transaction feature of mongoDB
  const session = await mongoose.startSession();

  session.startTransaction();

  const { to, amount } = req.body;

  //fetching account within transaction
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient Balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  //Perform the transaction
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  //Commiting transaction as everything is alright till end of transaction
  await session.commitTransaction();

  res.json({
    message: "Transfer Successfull",
  });
});

module.exports = router;
