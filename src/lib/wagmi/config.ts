import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";

const sepoliaRpc = import.meta.env.VITE_SEPOLIA_RPC || "";

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(sepoliaRpc),
  },
});
