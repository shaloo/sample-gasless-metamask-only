//import { scw } from "@arcana/scw@0.0.22";
//import { scw } from "https\://unpkg.com/@arcana/scw@0.0.22/dist/standalone/scw.umd.js";
//import { myscw } from "@arcana/scw@0.0.22";

import { myerc20abi } from "./myerc20.js";

const clientId = "xar_dev_c2fb7be163754e57d384e24257ea2c8d2a5dd31a";

await window.ethereum.enable();
const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer = await provider.getSigner();
console.log("EOA: ", await signer.getAddress());

//use import statement - not working
//const appSCW = new myscw.SCW();
//const appSCW = arcana.scw.SCW();

//use scw.umd.js file to instantiate SCW object
const appSCW = new arcana.scw.SCW();

async function initSCW() {
  console.log("Intantiating SCW... ");
  document.querySelector("#result").innerHTML =
    "Initializing SCW. Please wait...";
  try {
    await appSCW.init(clientId, signer);
    console.log("Init SCW complete!");
    document.querySelector("#result").innerHTML = "SCW initialized.";
  } catch (e) {
    console.log(e);
  }
}

async function getSCWAddress() {
  console.log("Get SCW Address");

  try {
    const scwAddress = await appSCW.getSCWAddress();
    document.querySelector("#result").innerHTML = "SCW address:" + scwAddress;
  } catch (e) {
    console.log(e);
  }
}

async function gaslessTx() {
  console.log("Initiating gasless transaction...");
  try {
    let amount = ethers.utils.parseUnits("0", 2);

    // Specify the smart contract address as configured via the dashboard
    const erc20Address = "0x06F51271DCe73e3Fb09637e77Bfb0e996DAb39cf";

    const toAddress = "0xD12E6864A0f0f3Ea886400Ae7570E4341889bDa9";
    const Erc20Interface = new ethers.utils.Interface(myerc20abi);

    // Encode an ERC-20 token transfer to recipientAddress of the specified amount

    // Note: the 'transfer' operation  of the smart contract used below
    // must be whitelisted earlier via the dashboard for gasless transaction
    const encodedData = Erc20Interface.encodeFunctionData("transfer", [
      toAddress,
      amount,
    ]);

    // You need to create transaction objects of the following interface
    const tx0 = {
      from: appSCW.getSCWAddress(),
      to: erc20Address, // destination smart contract address
      data: encodedData,
    };

    let tx = await appSCW.doTx(tx0);
    let txDetails = await tx.wait();
    console.log("txHash:(CORRECT) " + txDetails.receipt.transactionHash);
    document.querySelector("#result").innerHTML =
      "txHash:" + txDetails.receipt.transactionHash;
  } catch (e) {
    console.log(e);
  }
  console.log("Gasless transaction done!");
}

document.querySelector("#Btn-Init-Auth").addEventListener("click", initSCW);

document
  .querySelector("#Btn-Get-SCW-Address")
  .addEventListener("click", getSCWAddress);

document
  .querySelector("#Btn-Do-Gasless-Tx")
  .addEventListener("click", gaslessTx);

