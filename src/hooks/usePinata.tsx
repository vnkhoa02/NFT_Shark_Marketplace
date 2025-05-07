import { useEffect, useState } from "react";

// Fetch a short-lived upload JWT from your backend
async function getUploadJwt(): Promise<string> {
  const res = await fetch(`/api/jwt`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to fetch JWT");
  const { token } = await res.json();
  return token;
}

export default function usePinata() {
  const [jwt, setJwt] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // 1) Load JWT once on mount
  useEffect(() => {
    getUploadJwt()
      .then(setJwt)
      .catch((err) => setError(err.message));
  }, []);

  // 2) Upload file directly to Pinata using JWT
  async function uploadFile(upFile: File): Promise<string> {
    if (!jwt) throw new Error("JWT not ready");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", upFile);
      formData.append("pinataMetadata", JSON.stringify({ name: upFile.name }));
      formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Pinata upload failed");
      }
      const { IpfsHash } = await res.json();
      const gateway = import.meta.env.VITE_GATEWAY_URL || "https://gateway.pinata.cloud";
      const url = `${gateway}/ipfs/${IpfsHash}`;
      setLink(url);
      return url;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      return "";
    } finally {
      setIsUploading(false);
    }
  }

  // 3) Upload JSON directly to Pinata using JWT
  async function uploadJSON(obj: object): Promise<string> {
    if (!jwt) throw new Error("JWT not ready");
    setIsUploading(true);
    try {
      const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(obj),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "JSON upload failed");
      }
      const { IpfsHash } = await res.json();
      const gateway = import.meta.env.VITE_GATEWAY_URL || "https://gateway.pinata.cloud";
      return `${gateway}/ipfs/${IpfsHash}`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      return "";
    } finally {
      setIsUploading(false);
    }
  }

  return {
    link,
    error,
    isUploading,
    uploadFile,
    uploadJSON,
    setLink,
  };
}
