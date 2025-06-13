Web3 Token Transfer App
A modern decentralized application (dApp) built with Next.js, React, and TypeScript, enabling users to connect their wallets and transfer ERC-20 tokens on the Sepolia testnet. The UI is designed with Tailwind CSS and Shadcn UI components, featuring a sleek radium and black theme.

✨ Features
Wallet Connection: Seamlessly connect to your MetaMask wallet.

Network Display: Shows the currently connected Ethereum network (Sepolia testnet).

Token Balance Display: Fetches and displays the connected wallet's WETH balance.

ERC-20 Token Transfer: Allows users to input a recipient address and an amount to transfer WETH.

Transaction Status: Provides real-time feedback on transaction initiation, sending, and confirmation using sonner toasts.

Responsive UI: Built with Tailwind CSS for an adaptive experience across devices.

Modern Tooling: Utilizes Next.js App Router, TypeScript, and wagmi for robust blockchain interactions.

🚀 Technologies Used
Next.js (App Router): React framework for building server-rendered and statically generated applications.

React: JavaScript library for building user interfaces.

TypeScript: Superset of JavaScript that adds static types.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Shadcn UI: Reusable UI components built with Radix UI and Tailwind CSS.

Wagmi: A collection of React Hooks for Ethereum.

Viem: A TypeScript interface for Ethereum that provides low-level primitives.

Sonner: A beautifully designed toast component for React.

PostCSS & Autoprefixer: For processing and transforming CSS with Tailwind.

Pino & Pino-pretty: For logging (pino-pretty is a dev dependency).

🛠️ Setup and Installation
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (v18.x or higher recommended)

npm (v9.x or higher recommended)

MetaMask browser extension installed and configured for Sepolia Test Network.

1. Clone the repository
git clone <repository-url> # Replace with your actual repository URL
cd my-token-app-ts

2. Install Dependencies
npm install

3. Initialize Shadcn UI (if not already done)
This command sets up Shadcn's configuration and basic components.
Follow the prompts (e.g., Yes for TypeScript, New York style, src/app/globals.css for global CSS, tailwind.config.ts, @/components alias, @/lib/utils alias, Yes for React Server Components).

npx shadcn@latest init

4. Add Shadcn UI Components
Add the specific UI components used in the application, including sonner for toasts.

npx shadcn@latest add button card input label sonner

5. Configure Environment Variables
Create a file named .env.local in the root of your project. Obtain a Sepolia RPC URL from a service like Alchemy or Infura (free tiers are available) and replace the placeholder.

NEXT_PUBLIC_ALCHEMY_API_KEY=YOUR_ALCHEMY_OR_INFURA_RPC_URL

6. Update Configuration Files
Ensure the following files have the correct content as provided in the project's source.

tailwind.config.ts: Ensure content array includes src/**/*.{js,jsx,ts,tsx} and the custom radium and black colors are defined correctly.

postcss.config.mjs: Must use ES Module syntax.

// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;

src/app/globals.css: Contains the Tailwind directives and custom CSS variables for the theme.

src/lib/wagmiConfig.ts: Configures wagmi with the Sepolia chain and your RPC URL.

src/lib/utils.ts: Contains the cn utility function used by Shadcn.

src/components/wallet-connect-button.tsx: The custom wallet connection component.

src/app/layout.tsx: The root layout of the Next.js App Router, importing global styles and providers.

src/app/page.tsx: The main application logic for token transfer.

7. Clean and Rebuild (Important for fresh setup/debugging)
If you encounter styling issues or module resolution errors, performing a clean reinstall can often help.

# Stop your development server if it's running (Ctrl + C)
rm -rf node_modules .next/ # Deletes node_modules and Next.js build cache
npm install # Reinstall dependencies
npm run dev # Restart the development server

8. Run the Development Server
npm run dev

Open your browser to http://localhost:3000 to see the application.

🤝 How to Use the App
Connect Wallet: Click on the "Connect Wallet" button and select your MetaMask wallet. Ensure your MetaMask is set to the Sepolia Test Network.

View Balance: Your connected address and WETH balance on Sepolia will be displayed.

Enter Recipient and Amount: Input a valid Sepolia wallet address in the "Recipient Address" field and the amount of WETH you wish to transfer in the "Amount (WETH)" field.

Send Tokens: Click the "Send Tokens" button. MetaMask will prompt you to confirm the transaction.

Monitor Transaction: Toast notifications will appear, guiding you through the transaction status (initiated, pending, confirmed, or failed). A transaction hash will also be displayed, linking to Etherscan for details.

⚠️ Important Notes
This application operates on the Sepolia Test Network. You will need Sepolia ETH for gas fees and Sepolia WETH to perform transfers. You can get Sepolia ETH from faucets.

Ensure your RPC URL in .env.local is valid for the Sepolia network.

The Buffer polyfill and BigInt usage are handled for compatibility.

The wagmi library automatically handles transaction preparation and error checking for useSendTransaction.