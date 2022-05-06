import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MintableERC20__factory, Pool__factory } from "../../typechain";

describe("Pool", () => {
  const setup = async (deployer: SignerWithAddress) => {
    const [token, rewardToken] = await Promise.all([
      new MintableERC20__factory(deployer).deploy("Token", "TOKEN"),
      new MintableERC20__factory(deployer).deploy("Reward Token", "REWARD_TOKEN")
    ])

    await Promise.all([
      token.deployTransaction.wait(),
      rewardToken.deployTransaction.wait()
    ])
    const pool = await new Pool__factory(deployer).deploy(token.address, rewardToken.address)
    await pool.deployTransaction.wait()

    return {
      token,
      rewardToken,
      pool
    }
  }

  it("Should create Pool with selected parameter", async () => {
    const [owner] = await ethers.getSigners();
    const { token, rewardToken, pool } = await setup(owner)

    expect(token.address, await pool.token())
    expect(rewardToken.address, await pool.rewardToken())
    expect("0", (await pool.totalSupply()).toString())
    expect(ethers.utils.parseEther(String(1_000_000)), (await pool.maxSupply()).toString())
    expect(ethers.utils.parseEther(String(1_000_000)), (await rewardToken.balanceOf(pool.address)).toString())

    expect("0", (await token.balanceOf(pool.address)).toString())
    expect("0", (await pool.balanceOf(owner.address)).toString())
  })

  describe("Enable to deposit & get rewardToken", () => {
    it("success", async () => {
      const [owner, depositor] = await ethers.getSigners();
      const { token, rewardToken, pool } = await setup(owner)
 
      let tx;
      
      // Prerequisites
      expect(ethers.utils.parseEther("0"), (await token.balanceOf(depositor.address)).toString())
      expect(ethers.utils.parseEther("0"), (await rewardToken.balanceOf(depositor.address)).toString())
      tx = await token.connect(depositor).mint(ethers.utils.parseEther("0.05"), { from: depositor.address })
      await tx.wait()
      expect(ethers.utils.parseEther("0.05"), (await token.balanceOf(depositor.address)).toString())
      expect(ethers.utils.parseEther("0"), (await rewardToken.balanceOf(depositor.address)).toString())

      // deposit
      tx = await token.connect(depositor).approve(pool.address, "1", { from: depositor.address })
      await tx.wait()
      tx = await pool.connect(depositor).deposit("1", { from: depositor.address })
      await tx.wait()
      expect(ethers.utils.parseEther("0.04"), (await token.balanceOf(depositor.address)).toString())
      expect(ethers.utils.parseEther("0.01"), (await rewardToken.balanceOf(depositor.address)).toString())
    })
  })
})