import { expect } from "chai";
import { ethers } from "hardhat";
import { MintableERC20__factory } from "../../typechain";

describe("MintableERC20", () => {
  it("Should create ERC20 with selected parameter & default decimals", async () => {
    const _name = "Test Token"
    const _symbol = "TEST"

    const [owner] = await ethers.getSigners();
    const token = await new MintableERC20__factory(owner).deploy(_name, _symbol)
    await token.deployTransaction.wait()
    
    expect(_name, await token.name())
    expect(_symbol, await token.symbol())
    expect("18", (await token.decimals()).toString())
    expect("0", await (await token.totalSupply()).toString())
  })
})