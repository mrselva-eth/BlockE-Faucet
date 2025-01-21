"use client"

import { useState, useEffect } from "react"
import Web3 from "web3"
import ReCAPTCHA from "react-google-recaptcha"
import Image from "next/image"
import type { MetaMaskInpageProvider } from "@metamask/providers"
import { LogOut, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

type ClaimStatus = "idle" | "loading" | "success" | "error"

interface Transaction {
  hash: string
  timestamp: string
}

export default function Home() {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [network, setNetwork] = useState<string | null>(null)
  const [captchaSolved, setCaptchaSolved] = useState(false)
  const [secretWord, setSecretWord] = useState("")
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("idle")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null)
  const [showDisconnect, setShowDisconnect] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [showSecretWord, setShowSecretWord] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const connectWallet = async () => {
    const ethereum = window.ethereum as MetaMaskInpageProvider
    if (ethereum !== undefined) {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
        const web3Instance = new Web3(ethereum as any)
        setWeb3(web3Instance)
        const accounts = await web3Instance.eth.getAccounts()
        setAccount(accounts[0])
        const networkId = await web3Instance.eth.net.getId()
        setNetwork(networkId.toString())
      } catch (error) {
        console.error("Failed to connect to wallet:", error)
        setAlertMessage("Failed to connect to wallet. Please try again.")
      }
    } else {
      setAlertMessage("Please install MetaMask!")
    }
  }

  const disconnectWallet = () => {
    setWeb3(null)
    setAccount(null)
    setNetwork(null)
    setShowDisconnect(false)
    setCaptchaSolved(false)
    setSecretWord("")
    setClaimStatus("idle")
  }

  const switchToPolygon = async () => {
    if (!web3) return
    const ethereum = window.ethereum as MetaMaskInpageProvider
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }], // Polygon Mainnet
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x89",
                chainName: "Polygon Mainnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://polygon-rpc.com/"],
                blockExplorerUrls: ["https://polygonscan.com/"],
              },
            ],
          })
        } catch (addError) {
          console.error("Failed to add Polygon network:", addError)
          setAlertMessage("Failed to add Polygon network. Please try again.")
        }
      }
      console.error("Failed to switch to Polygon network:", switchError)
      setAlertMessage("Failed to switch to Polygon network. Please try again.")
    }
  }

  const claimTokens = async () => {
    if (!web3 || !account || !captchaSolved) return
    setClaimStatus("loading")
    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: account, secretWord }),
      })
      const data = await response.json()
      if (response.ok) {
        setClaimStatus("success")
        setCurrentTxHash(data.txHash)
        setTransactions((prev) => [...prev, { hash: data.txHash, timestamp: new Date().toISOString() }])
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 10000)
      } else {
        setClaimStatus("error")
        if (data.error === "Address has already claimed") {
          setAlertMessage("You have already claimed tokens. Only one claim per address is allowed.")
        } else if (data.error === "Insufficient funds in faucet") {
          setAlertMessage("The faucet wallet currently has insufficient funds. Please try again later.")
        } else if (data.error === "Invalid secret word") {
          setAlertMessage("Invalid secret word. Please try again.")
        } else {
          setAlertMessage(data.error || "Failed to claim tokens. Please try again.")
        }
      }
    } catch (error) {
      console.error("Failed to claim tokens:", error)
      setClaimStatus("error")
      setAlertMessage("An error occurred while claiming tokens. Please try again.")
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      const ethereum = window.ethereum as MetaMaskInpageProvider
      if (ethereum !== undefined) {
        const web3Instance = new Web3(ethereum as any)
        try {
          const accounts = await web3Instance.eth.getAccounts()
          if (accounts.length > 0) {
            setWeb3(web3Instance)
            setAccount(accounts[0])
            const networkId = await web3Instance.eth.net.getId()
            setNetwork(networkId.toString())
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error)
        }
      }
    }
    checkConnection()
  }, [])

  return (
    <div
      className="min-h-screen bg-cover bg-center py-6 flex flex-col justify-center sm:py-12 relative"
      style={{ backgroundImage: "url('/back.png')" }}
    >
      {account && (
        <div className="absolute top-4 right-4">
          <button className="Btn" onClick={disconnectWallet}>
            <div className="sign">
              <LogOut className="h-4 w-4 text-white" />
            </div>
            <div className="text">Logout</div>
          </button>
        </div>
      )}
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center">
              <Image src="/blocke-logo.png" alt="BlockE Logo" width={100} height={100} priority />
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text">
                  BlockE Faucet
                </h2>
                {!account && (
                  <button className="button" onClick={connectWallet}>
                    <span>Connect Wallet</span>
                  </button>
                )}
                {account && network !== "137" && (
                  <button className="button" onClick={switchToPolygon}>
                    <span>Switch to Polygon</span>
                  </button>
                )}
                {account && network === "137" && (
                  <>
                    <p className="font-medium">
                      Connected: {account.slice(0, 6)}...{account.slice(-4)}
                    </p>
                    <div className="relative">
                      <input
                        type={showSecretWord ? "text" : "password"}
                        placeholder="Enter secret word"
                        value={secretWord}
                        onChange={(e) => setSecretWord(e.target.value)}
                        className="w-full px-3 py-2 pr-10 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretWord(!showSecretWord)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showSecretWord ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                      onChange={() => setCaptchaSolved(true)}
                    />
                    <button
                      className="button"
                      onClick={claimTokens}
                      disabled={!captchaSolved || !secretWord || claimStatus === "loading"}
                    >
                      <span>{claimStatus === "loading" ? "Claiming..." : "Claim 0.1 MATIC"}</span>
                    </button>
                  </>
                )}
                {claimStatus === "success" && (
                  <div className="mt-2 text-sm text-center text-green-600">
                    Claim successful!
                    {currentTxHash && (
                      <p>
                        Transaction Hash:{" "}
                        <a
                          href={`https://polygonscan.com/tx/${currentTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {currentTxHash.slice(0, 10)}...{currentTxHash.slice(-8)}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {transactions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
                <ul className="space-y-2">
                  {transactions.map((tx, index) => (
                    <li key={index} className="text-sm">
                      <a
                        href={`https://polygonscan.com/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {new Date(tx.timestamp).toLocaleString()} - {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {alertMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
            <p className="text-center text-gray-800">{alertMessage}</p>
            <button className="button mt-4" onClick={() => setAlertMessage(null)}>
              <span>Close</span>
            </button>
          </div>
        </div>
      )}
      <div className="fixed bottom-4 right-4 text-sm text-white">
        <p className="text-shadow">
          If you don&apos;t have a secret code, contact BlockE CEO on{" "}
          <Link
            href="https://www.linkedin.com/in/mrselvadoteth/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-200 transition-colors duration-200"
          >
            LinkedIn
          </Link>
        </p>
      </div>
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
          <p>Faucet successfully claimed!</p>
          <p>Now go to BlockE using the below link and start interact:</p>
          <a href="https://block-e-nine.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline">
            https://block-e-nine.vercel.app/
          </a>
        </div>
      )}
    </div>
  )
}

