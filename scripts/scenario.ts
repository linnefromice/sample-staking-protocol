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
  console.log("START scenario")
  const [owner] = await ethers.getSigners();
  const { mocks, pools, stakingPool, tokens } = addresses

  let tx;
  // approves
  tx = await ERC20__factory.connect(mocks.dai, owner).approve(pools.dai, ethers.constants.MaxUint256)
  await tx.wait()
  tx = await ERC20__factory.connect(mocks.trueUsd, owner).approve(pools.trueUsd, ethers.constants.MaxUint256)
  await tx.wait()
  tx = await ERC20__factory.connect(tokens.govToken, owner).approve(stakingPool, ethers.constants.MaxUint256)
  await tx.wait()

  // deposit & stake
  tx = await Pool__factory.connect(pools.dai, owner).deposit(ethers.utils.parseEther("25"))
  await tx.wait()
  tx = await Pool__factory.connect(pools.trueUsd, owner).deposit(ethers.utils.parseEther("25"))
  await tx.wait()
  tx = await StakingPool__factory.connect(stakingPool, owner).stake(ethers.utils.parseEther("40"))
  await tx.wait()

  console.log("FINISH scenario")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});