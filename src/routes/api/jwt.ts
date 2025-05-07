import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/jwt")({
  GET: async () => {
    try {
      // Define your key restrictions however you like
      const keyRestrictions = {
        keyName: "Signed Upload JWT",
        maxUses: 2,
        permissions: {
          endpoints: {
            data: { pinList: false, userPinnedDataTotal: false },
            pinning: {
              pinFileToIPFS: true,
              pinJSONToIPFS: true,
              pinJobs: false,
              unpin: false,
              userPinPolicy: false,
            },
          },
        },
      };

      const resp = await fetch("https://api.pinata.cloud/users/generateApiKey", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          // Use your master Pinata key (or JWT) here:
          authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify(keyRestrictions),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Pinata error: ${text}`);
      }

      const { JWT } = await resp.json();
      return json({ token: JWT }, { status: 200 });
    } catch (err) {
      console.error("Error generating upload JWT:", err);
      return json(
        { error: err instanceof Error ? err.message : String(err) },
        { status: 500 },
      );
    }
  },
});
