import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter"
import 'hardhat-log-remover';
import "./scripts/deploy";
import "hardhat-docgen";
import {PRIV_MAINNET_ACCOUNT} from "./env";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },

    bsc_mainnet: {
      url: "https://bsc-dataseed2.binance.org/",
      chainId: 56,
      accounts: [PRIV_MAINNET_ACCOUNT],
    },
    bsc_mainnet_test: {
      url: "https://bsc-dataseed2.binance.org/",
      chainId: 56,
      accounts: [],
    },
    bsc_testnet: {
      url: "https://rpc.ankr.com/bsc_testnet_chapel",
      chainId: 97,
      accounts: []
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: "BNB",
    gasPrice : 5
  },
  etherscan: {
    apiKey: "VKPENS57I9DCN68A844N1RUGK1IU42J9UC",
  },
  typechain: {
    outDir: "typeChain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 100000,
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  }
};

export default config;
