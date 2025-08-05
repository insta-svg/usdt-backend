# USDT Transfer Backend (BSC)

Backend service to transfer USDT (BEP-20) using `transferFrom()` on Binance Smart Chain.

## 📦 POST /transfer

Send a POST request with JSON:

```json
{
  "from": "user_wallet_address",
  "amount": "10"
}
