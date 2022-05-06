import { expect } from "chai";
import { ethers } from "hardhat";
import { MintableERC20__factory, Pool__factory } from "../../typechain";

describe("Pool", () => {
  it("Should create Pool with selected parameter", async () => {
    const [owner] = await ethers.getSigners();
    
    const [token, rewardToken] = await Promise.all([
      new MintableERC20__factory(owner).deploy("Token", "TOKEN"),
      new MintableERC20__factory(owner).deploy("Reward Token", "REWARD_TOKEN")
    ])
    await Promise.all([
      token.deployTransaction.wait(),
      rewardToken.deployTransaction.wait()
    ])
    const pool = await new Pool__factory(owner).deploy(token.address, rewardToken.address)
    await pool.deployTransaction.wait()

    expect(token.address, await pool.token())
    expect(rewardToken.address, await pool.rewardToken())
    expect("0", (await pool.totalSupply()).toString())
    expect("0", (await pool.balanceOf(owner.address)).toString())
  })
})