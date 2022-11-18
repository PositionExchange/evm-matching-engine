import {task} from "hardhat/config";
import {verifyContract} from "./utils";


task('deploy-matching-template-testnet', 'How is your girl friend?', async (taskArgs, hre) => {


    const matchingTemplate = await hre.ethers.getContractFactory("MatchingEngineAMM")

    const contractArgs: string[] = [
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000"
    ];


    const hardhatDeployContract = await matchingTemplate.deploy();

    await hardhatDeployContract.deployTransaction.wait(5);

    const address = hardhatDeployContract.address
    console.log("matching template deployed address: ", address);

    await verifyContract(hre, address, [], "contracts/MatchingEngineAMM.sol:MatchingEngineAMM");
})