import "@walletconnect/react-native-compat";
import "@ethersproject/shims";
import {
	createAppKit,
	defaultConfig,
	AppKit,
} from "@reown/appkit-ethers5-react-native";
import { AuthProvider } from "@reown/appkit-auth-ethers-react-native";
import { Appearance } from 'react-native';

// 1. Get projectId from https://dashboard.reown.com
const projectId = "3884fb759d88894b6f159672aa4aab94"; // TODO: Replace with your actual projectId

// 2. Create config metadata
const metadata = {
	name: "GeniXera",
	description: "GeniXera Wallet Login",
	url: "https://reown.com/appkit",
	icons: ["https://avatars.githubusercontent.com/u/179229932"],
	redirect: {
		native: "genixera://",
	},
};

// 3. Define your chains
const mainnet = {
	chainId: 1,
	name: "Ethereum",
	currency: "ETH",
	explorerUrl: "https://etherscan.io",
	rpcUrl: "https://cloudflare-eth.com",
};

const polygon = {
	chainId: 137,
	name: "Polygon",
	currency: "MATIC",
	explorerUrl: "https://polygonscan.com",
	rpcUrl: "https://polygon-rpc.com",
};

const chains = [mainnet, polygon];

// Configure AppKit with auth provider
const authProvider = new AuthProvider({ 
    projectId, 
    metadata,
    // Configure auth to match dashboard settings
    auth: {
        redirectUrl: metadata.redirect.native,
        domain: "https://auth.web3auth.io",
        scope: "openid profile email",
        web3auth: {
            verifier: projectId,
            clientId: projectId,
            network: "sapphire_mainnet", // Add network configuration
            chainConfig: {
                chainId: "0x1", // Ethereum mainnet
                rpcTarget: "https://cloudflare-eth.com",
                displayName: "Ethereum Mainnet",
                blockExplorer: "https://etherscan.io",
                ticker: "ETH",
                tickerName: "Ethereum"
            },
            loginConfig: {
                google: { 
                    name: "Google",
                    verifier: projectId,
                    typeOfLogin: "google",
                    showOnModal: true
                },
                x: { 
                    name: "X (Twitter)",
                    verifier: projectId,
                    typeOfLogin: "twitter",
                    showOnModal: true
                },
                discord: { 
                    name: "Discord",
                    verifier: projectId,
                    typeOfLogin: "discord",
                    showOnModal: true
                },
                farcaster: { 
                    name: "Farcaster",
                    verifier: projectId,
                    typeOfLogin: "farcaster",
                    showOnModal: true
                },
                github: { 
                    name: "GitHub",
                    verifier: projectId,
                    typeOfLogin: "github",
                    showOnModal: true
                },
                apple: { 
                    name: "Apple",
                    verifier: projectId,
                    typeOfLogin: "apple",
                    showOnModal: true
                },
                facebook: { 
                    name: "Facebook",
                    verifier: projectId,
                    typeOfLogin: "facebook",
                    showOnModal: true
                }
            }
        }
    }
});

// Create the final config with auth provider
const initialConfig = defaultConfig({
    metadata,
    extraConnectors: [authProvider],
    autoConnect: true,
    enableAnalytics: true,
    enableAuthMode: true
});

// Initialize AppKit
createAppKit({
    projectId,
    metadata,
    chains,
    config: initialConfig,
    features: {
        swaps: true,
        onramp: true,
        email: true,
        socials: ["google", "x", "discord", "farcaster", "github", "apple", "facebook"],
        emailShowWallets: true
    },
    // Configure specific provider settings
    providers: {
        web3auth: {
            email: true,
            social: ["google", "x", "discord", "farcaster", "github", "apple", "facebook"]
        }
    },
    // Use system theme by default
    themeMode: Appearance.getColorScheme() || 'light',
    // Set theme variables to match your app's theme
    themeVariables: {
        accent: '#D2BD00',            // Your app's accent color
        foreground: '#000000',        // Text color for light mode
        background: '#FFFEFF',        // Background color for light mode
        modalBackground: '#FFFEFF',   // Modal background for light mode
        text: '#000000',             // Primary text color
        secondaryText: '#666666',    // Secondary text color
        border: '#E0E0E0',          // Border color
        success: '#1DB954',         // Success color for notifications/status
        error: '#FF4B4B',          // Error color for notifications/status
    }
});

export { AppKit };
