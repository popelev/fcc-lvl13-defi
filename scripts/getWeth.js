const { getNamedAccounts, ethers } = require("hardhat")

const AMOUNT = ethers.utils.parseEther("0.02")
const WETH_TOKEN = process.env.WETH_TOKEN_MAINNET

async function getWeth() {
    const { deployer } = await getNamedAccounts()
    const iWeth = await ethers.getContractAt("IWeth", WETH_TOKEN, deployer)
    const tx = await iWeth.deposit({ value: AMOUNT })
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log("wETH deployer balance = " + wethBalance.toString() + " WETH")
}

module.exports = { getWeth, AMOUNT }
