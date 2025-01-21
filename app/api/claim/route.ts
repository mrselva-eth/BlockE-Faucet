import { type NextRequest, NextResponse } from "next/server"
import Web3 from "web3"
import { MongoClient } from "mongodb"

const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY
const RPC_URL = process.env.POLYGON_RPC_URL
const SECRET_WORD = process.env.SECRET_WORD
const MONGODB_URI = process.env.MONGODB_URI

if (!FAUCET_PRIVATE_KEY || !RPC_URL || !SECRET_WORD || !MONGODB_URI) {
  console.error("Missing environment variables")
  process.exit(1)
}

const web3 = new Web3(RPC_URL)

let client: MongoClient | null = null

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI as string)
    await client.connect()
  }
  return client.db("blocke").collection("faucet")
}

export async function POST(req: NextRequest) {
  try {
    const { address, secretWord } = await req.json()

    if (secretWord !== SECRET_WORD) {
      return NextResponse.json({ error: "Invalid secret word" }, { status: 400 })
    }

    const collection = await connectToDatabase()
    const existingClaim = await collection.findOne({ address })

    if (existingClaim) {
      return NextResponse.json({ error: "Address has already claimed" }, { status: 400 })
    }

    try {
      const faucetAccount = web3.eth.accounts.privateKeyToAccount(FAUCET_PRIVATE_KEY as string)
      web3.eth.accounts.wallet.add(faucetAccount)

      const faucetBalance = await web3.eth.getBalance(faucetAccount.address)
      const amountToSend = web3.utils.toWei("0.1", "ether")

      if (BigInt(faucetBalance) < BigInt(amountToSend)) {
        return NextResponse.json({ error: "Insufficient funds in faucet" }, { status: 400 })
      }

      const tx = await web3.eth.sendTransaction({
        from: faucetAccount.address,
        to: address,
        value: amountToSend,
        gas: "21000",
        gasPrice: await web3.eth.getGasPrice(),
      })

      await collection.insertOne({ address, claimedAt: new Date() })

      return NextResponse.json({ message: "Claim successful", txHash: tx.transactionHash })
    } catch (error) {
      console.error("Error in claim:", error)
      return NextResponse.json({ error: "Failed to process claim" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in POST request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

