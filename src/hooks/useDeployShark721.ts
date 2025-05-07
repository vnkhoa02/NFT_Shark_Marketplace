import { deployContract, waitForTransactionReceipt } from "@wagmi/core";
import shark721Json from "abi/Shark721NFT.json";
import { useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { config } from "~/lib/wagmi/config";

interface DeployArgs {
  name: string;
  symbol: string;
  royaltyRecipient: Address;
  royaltyBps: number;
}

export function useDeployShark721() {
  const { address: connectedAddress } = useAccount();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const deploy = async ({ name, symbol, royaltyRecipient, royaltyBps }: DeployArgs) => {
    setIsDeploying(true);
    setError(null);
    setDeployedAddress("");

    try {
      const hash = await deployContract(config, {
        abi: shark721Json.abi,
        args: [name, symbol, royaltyRecipient, royaltyBps],
        bytecode: shark721Json.bytecode as `0x${string}`,
      });
      const receipt = await waitForTransactionReceipt(config, {
        hash,
      });
      const contractAddress = receipt.contractAddress;
      if (!contractAddress) {
        throw new Error("Contract address not found in transaction receipt");
      }
      setDeployedAddress(contractAddress);
      return contractAddress;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed");
      throw err;
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    deploy,
    isDeploying,
    deployedAddress,
    error,
    connectedAddress,
  };
}
