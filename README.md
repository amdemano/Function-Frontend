# Simple Smart Contract

This repository contains a simple Solidity smart contract named `Assessment` that allows for basic deposit, withdraw, burn, and mint functionalities.

## Features

- **Deposit**: Allows the owner to deposit funds into the contract.
- **Withdraw**: Allows the owner to withdraw funds from the contract.
- **Burn**: Allows the owner to burn (reduce) the contract's balance.
- **Mint**: Allows the owner to mint (increase) the contract's balance.

## Getting Started
### Installation

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/
