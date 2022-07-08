const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("../scripts/getWeth")
const lendingPoolAddress_Mainnet = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"
const WETH_TOKEN = process.env.WETH_TOKEN_MAINNET

async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()

    const lendingPool = await getLendingPool(deployer, lendingPoolAddress_Mainnet)
    console.log("Lending pool address " + lendingPool.address)

    // Deposit
    const wethTokenAddress = WETH_TOKEN
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Depositing...")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited")

    //Borrow
}

async function getBorrowUserData(lendingPool, account) {}

async function getLendingPool(account, lendingPoolAddress_Mainnet) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        lendingPoolAddress_Mainnet,
        account
    )
    const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool
}

async function approveErc20(erc20Address, spenderAddress, ammountToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account)
    const tx = await erc20Token.approve(spenderAddress, ammountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
