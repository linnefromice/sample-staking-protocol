import { ethers } from "hardhat";
import { ERC20__factory, Pool__factory, StakingPool__factory } from "../typechain";

// need updates
const addresses = {
  mocks: {
    dai: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    trueUsd: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  },
  pools: {
    dai: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    trueUsd: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
  },
  stakingPool: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  tokens: {
    govToken: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    veToken: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
  }
}

async function main() {
  console.log("START check-user-status")
  const [owner] = await ethers.getSigners();

  const tokens = [
    addresses.mocks.dai,
    addresses.mocks.trueUsd,
    addresses.tokens.govToken,
    addresses.tokens.veToken
  ]
  for await (const addr of tokens) {
    const _instance = await ERC20__factory.connect(addr, owner)
    console.log(await _instance.name())
    console.log(await _instance.balanceOf(owner.address))
  }

  console.log("FINISH check-user-status")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});