import { ethers } from "hardhat";
import { MintableERC20__factory } from "../typechain";

// need updates
const addresses = {
  mocks: {
    dai: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    trueUsd: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  }
}

async function main() {
  console.log("START mock mint")
  const [owner] = await ethers.getSigners();

  const mocks = [addresses.mocks.dai, addresses.mocks.trueUsd]
  for await (const addr of mocks) {
    const _instance = await MintableERC20__factory.connect(
      addr,
      owner,
    )
    const tx = await _instance.mint(ethers.utils.parseEther("50"))
    await tx.wait()
  }
  
  console.log("FINISH mock mint")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});