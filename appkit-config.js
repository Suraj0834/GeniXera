import "@walletconnect/react-native-compat";
import "@ethersproject/shims";
import {
	createAppKit,
	defaultConfig,
	AppKit,
} from "@reown/appkit-ethers5-react-native";

// 1. Get projectId from https://dashboard.reown.com
const projectId = "36fda7c3a8693df3bac279b5a9aa1df2"; // TODO: Replace with your actual projectId

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

const config = defaultConfig({ metadata });

// 4. Create modal
createAppKit({
	projectId,
	metadata,
	chains,
	config,
	enableAnalytics: true,
	providers: [
		'email',
		'google',
		'apple',
		'github',
		'discord',
		'farcaster',
		'twitter', // X
	],
});

export { AppKit };
