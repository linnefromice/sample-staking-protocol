import { ethers } from "hardhat";
import { MintableERC20__factory, Pool__factory, SampleGovToken__factory, SampleVeToken__factory, StakingPool__factory } from "../typechain";

async function main() {
  const [owner] = await ethers.getSigners();

  // deploy mocks
  const [mockDai, mockTrueUsd] = await Promise.all([
    new MintableERC20__factory(owner).deploy("Mock Dai Stablecoin", "mockDAI"),
    new MintableERC20__factory(owner).deploy("Mock TrueUSD", "mockTUSD"),
  ])
  await Promise.all([
    mockDai.deployTransaction.wait(),
    mockTrueUsd.deployTransaction.wait()
  ])

  // main deployments
  const govToken = await new SampleGovToken__factory(owner).deploy()
  await govToken.deployTransaction.wait()

  const [daiPool, trueUsdPool] = await Promise.all([
    new Pool__factory(owner).deploy(mockDai.address, govToken.address),
    new Pool__factory(owner).deploy(mockTrueUsd.address, govToken.address)
  ])
  await Promise.all([
    daiPool.deployTransaction.wait(),
    trueUsdPool.deployTransaction.wait()
  ])

  const veToken = await new SampleVeToken__factory(owner).deploy(owner.address)
  await veToken.deployTransaction.wait()
  const stakingPool = await new StakingPool__factory(owner).deploy(govToken.address, veToken.address)
  await stakingPool.deployTransaction.wait()
  await veToken.setOperator(stakingPool.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
