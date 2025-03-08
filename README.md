# BlockE Faucet

A Web3 faucet application that allows users to claim MATIC tokens on the Polygon network. Built with **Next.js**, **Web3.js**, and **MongoDB**.

## Interface 

![image](https://github.com/user-attachments/assets/f4532120-90a4-4c85-a404-252d5704cee1)


## Deployed link : https://block-e-faucet.vercel.app/
---

## 🚀 Features

- ✅ **Connect to MetaMask Wallet**
- ✅ **Automatic Network Detection & Switching to Polygon**
- ✅ **reCAPTCHA Verification to Prevent Bots**
- ✅ **Secret Word Verification for Authorized Access**
- ✅ **MongoDB Integration to Prevent Duplicate Claims**
- ✅ **Transaction History Tracking**
- ✅ **Responsive UI with a Modern Design**
- ✅ **Secure Environment Variable Configuration**

---

## 🛠️ Technologies Used

### **Frontend**
- **Next.js** – React framework for server-side rendering and static site generation.
- **React.js** – Component-based UI development.
- **Tailwind CSS** – Utility-first styling framework.

### **Blockchain Interaction**
- **Web3.js** – Ethereum JavaScript API for interacting with smart contracts.
- **MetaMask** – Browser extension for Ethereum transactions.

### **Backend**
- **Next.js API Routes** – Serverless backend for handling claims and transactions.

### **Database**
- **MongoDB** – Stores user addresses to prevent duplicate claims.

### **Security**
- **Google reCAPTCHA** – Protects against bots.
- **Secret Word Verification** – Ensures only authorized users can claim tokens.

---

## 📌 Prerequisites

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **MetaMask Browser Extension**
- **MongoDB Database**
- **Polygon RPC Endpoint**
- **Faucet Wallet with MATIC Tokens**

---

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/mrselva-eth/BlockE-Faucet.git
cd BlockE-Faucet
```

### **2️⃣ Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env.local` file in the root directory and add the following variables:

```plaintext
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
FAUCET_PRIVATE_KEY=your_faucet_wallet_private_key
POLYGON_RPC_URL=your_polygon_rpc_url
SECRET_WORD=your_secret_word
MONGODB_URI=your_mongodb_connection_string
```

### **4️⃣ Run the Development Server**
```bash
npm run dev
# or
yarn dev
```

### **5️⃣ Open the Application**
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA site key |
| `FAUCET_PRIVATE_KEY` | Private key of the faucet wallet sending MATIC tokens |
| `POLYGON_RPC_URL` | Polygon network RPC URL |
| `SECRET_WORD` | Secret word required for claiming tokens |
| `MONGODB_URI` | Connection string for MongoDB |

---

## 🏗️ Usage Guide

1. **Connect MetaMask Wallet**: Click "Connect Wallet" to link your wallet.
2. **Switch to Polygon Network**: If not already on Polygon, click "Switch to Polygon".
3. **Enter Secret Word**: Input the secret word required for claiming tokens.
4. **Complete reCAPTCHA Verification**: Ensure you're a human.
5. **Claim Tokens**: Click "Claim 0.1 MATIC" to receive your tokens.
6. **View Transaction History**: Check your claim status and transaction hash at the bottom.

---

## 🚀 Deployment

### **Deploying to Vercel**

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Configure environment variables in the Vercel dashboard.
4. Deploy the application with one click.

---

## 🔒 Security Considerations

- **Do not expose your faucet wallet's private key.** Store it securely in environment variables.
- **Secret word verification adds an extra security layer** to prevent unauthorized claims.
- **MongoDB ensures that addresses cannot claim tokens multiple times.**
- **Google reCAPTCHA protects against automated bot claims.**

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to your branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

If you need assistance or don't have a secret word, contact BlockE CEO:

- **LinkedIn**: [mrselva.eth](https://www.linkedin.com/in/mrselvadoteth/)

---

## 🏆 Acknowledgements

A huge thanks to these amazing tools and platforms:

- [Next.js](https://nextjs.org/)
- [Web3.js](https://web3js.readthedocs.io/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MetaMask](https://metamask.io/)
- [Polygon Network](https://polygon.technology/)

---

🚀 **Enjoy using BlockE Faucet and happy coding!**

