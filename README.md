# 💖 **FundIt8 - The Blockchain-Powered Charity Donation Platform** (Fund It Donate)

**FundIt8** is a next-generation **blockchain-based** solution transforming how the world engages in **donation tracking**. Powered by **smart contracts**, we ensure unmatched **trust**, **transparency**, and **efficiency** in the charitable world. Whether you're a passionate **donor** or a purpose-driven **charity organization**, FundIt8 simplifies, accelerates, and secures your journey in supporting impactful causes.

## 🚨 **Problem Statement**

The current charitable donation ecosystem is plagued by significant challenges, undermining donor confidence, reducing the impact of contributions, and hindering the ability of charities to operate effectively. These challenges include:

- **Lack of Transparency**: Donors have limited visibility into how their contributions are actually used by charitable organizations.
- **Trust Deficit**: Without clear tracking mechanisms, donors question whether their money reaches intended beneficiaries
- **Inefficient Fund Distribution**: Traditional donation systems involve multiple intermediaries, leading to delays and reduced impact
- **No Real-Time Tracking**: Donors cannot monitor the progress and impact of their donations in real-time
- **High Administrative Costs**: Conventional donation platforms charge significant fees, reducing the actual amount reaching causes 
- **Limited Accountability**: Charities lack standardized reporting mechanisms to demonstrate impact and build donor confidence 
- **Fraud and Mismanagement Risks**: Centralized systems are vulnerable to misuse of funds without proper oversight mechanisms
  
---
## 🌟 **Features That Set FundIt8 Apart** 
- **Automated Fund Release with Chainlink**: **Chainlink automation** triggers the release of funds once specific campaign milestones are met, ensuring **timely**, **secure**, and **trustless** fund distribution.
- **Honorable NFT Badges for Top Donors**: Top donors from each campaign are rewarded with an **honorary NFT badge**, recognizing their contributions and incentivizing continued support.
- **AI-Driven Donation Forecasts**: Get smart predictions on when your campaign will hit its goal—helping boost confidence and fine-tune your strategy.
- **AI-Powered Chatbot**: To assist both donors and organisations on guidance, inquiries, campaign assistance and much more.
- **Blockchain Data Indexing with The Graph for multiple use cases**: 
  1. **AI-Driven Donation Forecasts**: The Graph serves as a knowledge base for AI to predict campaign milestones.
  2. **Transaction History Tracking**: It traces all campaign transactions, providing a combined, chronological transaction history.
  3. **Leaderboard**: Real-time leaderboard of top donors, powered by data from The Graph.
  4. **Chatbot Knowledge Base**: The Graph is also used to provide a knowledge base for the AI-powered chatbot.
     
---
## 🔧 Technologies Used

| Category                  | Tools & Frameworks                                                                 |
|--------------------------|-------------------------------------------------------------------------------------|
| **Frontend**             | Next.js, React 18, TypeScript                                                       |
| **UI Components**        | Shadcn/UI, Tailwind CSS                                                             |
| **Data Visualization**   | Recharts                                                                            |
| **Form Handling**        | React Hook Form + Zod validation                                                    |
| **Blockchain**           | Ethereum (Solidity Smart Contracts)                                                 |
| **L2 Scaling**           | **Scroll** – For fast, low-cost transactions on Sepolia Testnet                     |
| **Database**             | **MongoDB** – Scalable storage for user and organization data                       |
| **Blockchain Indexing**  | **The Graph** – Efficient querying of on-chain data        |
| **Automation**           | **Chainlink Automation** – Trustless execution of milestone-based fund releases     |
| **AI Integration**       | Gemini API & Kimi K2 (via OpenRouter API) – For donation forecasting & insights |

---
## 📜 Smart Contract Addresses (Scroll Sepolia)

All contracts are deployed on **Scroll L2 (Sepolia Testnet)** for scalability and low gas fees.

| Contract                          | Address                                                                 | Explorer Link |
|-----------------------------------|-------------------------------------------------------------------------|---------------|
| **CharityCentral**                | `0x0928823D8B60D0f442b3a04b946948c2880f8C53`                            | [View on ScrollScan](https://sepolia.scrollscan.com/address/0x0928823D8B60D0f442b3a04b946948c2880f8C53) |
| **NFT Badge Contract**            | `0x00072fbb450DaeB68F5e209C270E8bC6afBC16DF`                            | [View on ScrollScan](https://sepolia.scrollscan.com/address/0x00072fbb450DaeB68F5e209C270E8bC6afBC16DF) |
| **CampaignAutomationHandler**   | `0xc97AF1e0a420e515F9EB3E5c977E131D44c4E412`                            | [View on ScrollScan](https://sepolia.scrollscan.com/address/0xc97AF1e0a420e515F9EB3E5c977E131D44c4E412) |

## 🔗 **The Graph**

FundIt8 utilizes **The Graph** for querying blockchain data related to donors, campaigns, and other key metrics. The Graph enables efficient querying and indexing of blockchain data for faster and easier access to the platform's data.

- **Subgraph URL**:  
  [https://api.studio.thegraph.com/query/105145/fund-it-8/version/latest](https://api.studio.thegraph.com/query/105145/fund-it-8/version/latest)
  
- **Subgraph Repository**:  
  [https://github.com/johnp2003/fund-it-8](https://github.com/johnp2003/fund-it-8)

The Graph helps us query donor information and manage the leaderboard effectively, ensuring accurate and real-time data retrieval for our campaigns and donor engagement.

---

# Example Queries in Source Code

## 1. Query for AI Campaign Prediction Knowledge Base

```graphql
query GetCampaignTransactions($campaignId: ID!) {
  campaign(id: $campaignId) {
    name
    totalDonated
    goal
    milestones {
      target
    }
    charity {
      address
    }
    donations(orderBy: timestamp, orderDirection: desc) {
      amount
      timestamp
      donor {
        address
      }
    }
  }
}
```

## 2. Query to Get Detailed Transactions and Timeline for Transparency

```graphql
query GetCampaignTransactions($campaignId: ID!) {
  campaign(id: $campaignId) {
    name
    totalDonated
    charity {
      address
    }
    donations(orderBy: timestamp, orderDirection: desc) {
      amount
      timestamp
      donor {
        address
      }
    }
    fundsReleased(orderBy: timestamp, orderDirection: desc) {
      amount
      recipient
      timestamp
      milestoneIndex
    }
  }
}
```

## 3. Query to Get Donor Information and Active Campaign Information for Personal Chatbot

### Get Donor Data
```graphql
query GetDonorData($donorAddress: Bytes!) {
  donor(id: $donorAddress) {
    id
    totalDonated
    donations(first: 5, orderBy: timestamp, orderDirection: desc) {
      id
      amount
      timestamp
      campaign {
        id
        name
        charity {
          name
        }
      }
    }
  }
}
```

### Get Active Campaigns
```graphql
query GetActiveCampaigns($donorAddress: Bytes!) {
  campaigns(where: { state: "Active" }) {
    id
    name
    description
    goal
    totalDonated
    state
    charity {
      address
      name
    }
    donors(where: { donor: $donorAddress }) {
      totalDonated
    }
  }
}
```

## 4. Leaderboard Query to Fetch Overall Leaderboard

```graphql
query GlobalLeaderboard {
  donors(orderBy: totalDonated, orderDirection: desc, first: 100) {
    address
    totalDonated
  }
}
```

---
## ⚙️ Chainlink Automation – Trustless Fund Releases

FundIt8 automates milestone-based fund distribution using **Chainlink Keepers**, ensuring secure, transparent, and timely releases — no manual intervention required.

- **Upkeep ID**:  
  `4871800235921376419268239553339602281259028813092345349597008872446383599039`

- **Upkeep Address**:  
  `0xc97AF1e0a420e515F9EB3E5c977E131D44c4E412`

> ✅ Funds are automatically released to charities **only when** predefined milestones are achieved — verified on-chain.

---

## 🎮 How It Works

### 🫶 For Donors

1. **Connect Wallet**  
   Use MetaMask or any EVM-compatible wallet connected to **Scroll RPC**.

2. **Browse Campaigns**  
   Explore verified charity campaigns with clear goals, milestones, and impact metrics.

3. **Donate Securely**  
   Contribute using **ETH** or supported tokens. All donations are recorded on-chain.

4. **Track Progress**  
   Monitor real-time funding progress and milestone achievements.

5. **Earn NFT Badges**  
   Top donors receive **exclusive NFT badges** as recognition — stored on-chain and viewable in your Donor Dashboard.

6. **Automatic Fund Release**  
   Funds are released to the charity only when milestones are met — verified and executed by **Chainlink Automation**.

7. **Stay Engaged**  
   View your donation history, impact stats, and participate in future campaigns.

---

### 🏢 For Organizations

1. **Register & Verify (KYB)**  
   Submit your organization details and complete **Know Your Business (KYB)** verification.

2. **Create a Campaign**  
   Set:
   - Fundraising goal
   - Milestones (e.g., ETH1, ETH2, ETH3)
   - Campaign description, media, and timeline

3. **Automated Fund Management**  
   FundIt8 auto-deploys a **smart contract** with **Chainlink Automation** to handle fund release upon milestone completion.

4. **Monitor in Real-Time**  
   Track donations, donor activity, and milestone progress via your Organization Dashboard.

5. **Recognize Donors**  
   View top donors and engage with your community. NFT badges incentivize continued support.

6. **Receive Funds Automatically**  
   Once a milestone is reached, funds are **automatically transferred** to your wallet — no delays, no intermediaries.

7. **Manage & Update**  
   Edit campaigns, add updates, or deactivate early. Any remaining funds are released immediately upon deactivation.

8. **AI-Powered Forecasting** 🚀  
   Leverage **AI-driven donation forecasting** to:
   - Predict funding timelines
   - Visualize donation trends
   - Optimize campaign strategy

---

## 🌍 Live Demo

👉 **[Try FundIt8 Now](https://fundit8.vercel.app/)**


---
## 🚀 **Getting Started**

### **Prerequisites**

Make sure you have the following installed on your machine:

- **Node.js** v18+ and **npm** or **yarn**
- **MetaMask** (connected to **Scroll RPC**) or another **crypto wallet** to connect with the platform

### **💻Installation**

Ready to dive in? Let's set up the project!

### **1️⃣ Clone the repository**  
```bash
git clone https://github.com/Aidenthien/fundit8
cd fundit8
```
### **2️⃣ Install dependencies**  
```bash
npm install
```
### **3️⃣ Set Up Environment Variables**  
Create a `.env.local` file in the root directory and add the following:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=""
NEXT_PUBLIC_PINATA_API_KEY=""
NEXT_PUBLIC_PINATA_API_SECRET=""
MONGODB_URI=""
NEXT_PUBLIC_SITE_URL=""
CONTRACT_OWNER_PRIVATE_KEY=""
YOUVERIFY_API_KEY=""
OCR_API_KEY=""
GEMINI_API_KEY=""
OPENROUTER_API_KEY=""
CG_API_KEY=""
```
⚠ **DO NOT expose your `.env.local` file in a public repository**. Add `.env.local` to your `.gitignore` file to prevent accidental leaks.

### **4️⃣ Run the local server**  
```bash
npm run dev
```
### **5️⃣ Connect to MetaMask**!

---

## **👥 Team**
- **John Paulose** – Full Stack Developer  
- **Thien Wei Jian** – Full Stack Developer    
- **Choo Yin Keat** – Full Stack Developer    
---

### **🌍 Empowering Change, One Blockchain Donation at a Time. Join the FundIt8 Revolution! ** ✊💖
