import { ethers } from "hardhat";
import { MintableERC20__factory, Pool__factory, SampleGovToken__factory, SampleVeToken__factory, StakingPool__factory } from "../typechain";

async function main() {
  console.log("START deploy-single")
  const [owner] = await ethers.getSigners();

  // deploy mocks
  console.log(`> Deploy mockDai`)
  const mockDai = await new MintableERC20__factory(owner).deploy("Mock Dai Stablecoin", "mockDAI")
  await mockDai.deployTransaction.wait()
  console.log(`> Deploy mockTrueUsd`)
  const mockTrueUsd = await new MintableERC20__factory(owner).deploy("Mock TrueUSD", "mockTUSD")
  await mockTrueUsd.deployTransaction.wait()

  // main deployments
  console.log(`> Deploy GovToken`)
  const govToken = await new SampleGovToken__factory(owner).deploy()
  await govToken.deployTransaction.wait()
  
  console.log(`> Deploy daiPool`)
  const daiPool = await new Pool__factory(owner).deploy(mockDai.address, govToken.address)
  await daiPool.deployTransaction.wait()
  console.log(`> Deploy trueUsdPool`)
  const trueUsdPool = await new Pool__factory(owner).deploy(mockTrueUsd.address, govToken.address)
  await trueUsdPool.deployTransaction.wait()

  console.log(`> Deploy VeToken`)
  const veToken = await new SampleVeToken__factory(owner).deploy(owner.address)
  await veToken.deployTransaction.wait()
  console.log(`> Deploy StakingToken`)
  const stakingPool = await new StakingPool__factory(owner).deploy(govToken.address, veToken.address)
  await stakingPool.deployTransaction.wait()
  console.log(`> SampleVeToken.setOperator`)
  await veToken.setOperator(stakingPool.address)
  console.log("FINISH deploy")
  console.log({
    mocks: {
      dai: mockDai.address,
      trueUsd: mockTrueUsd.address,
    },
    pools: {
      dai: daiPool.address,
      trueUsd: trueUsdPool.address,
    },
    stakingPool: stakingPool.address,
    tokens: {
      govToken: govToken.address,
      veToken: veToken.address
    }
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
