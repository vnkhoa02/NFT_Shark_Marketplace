import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { PinataSDK } from "pinata";

export const APIRoute = createAPIFileRoute("/api/presigned_url")({
  GET: async () => {
    try {
      // Initialize Pinata SDK with environment variables
      const pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT, // Pinata JWT
        pinataGateway: process.env.VITE_GATEWAY_URL, // Pinata Gateway URL
      });

      // Generate a presigned URL
      const url = await pinata.upload.public.createSignedURL({
        expires: 60, // URL expiration time in seconds
      });

      return json({ url }, { status: 200 });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      return json(
        { error: error instanceof Error ? error.message : "Internal server error" },
        { status: 500 },
      );
    }
  },
});
