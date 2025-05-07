import { PinataSDK } from "pinata";
import { useEffect, useMemo, useState } from "react";

async function getUploadJwt(): Promise<string> {
  const res = await fetch(`/api/jwt`);
  if (!res.ok) throw new Error("Failed to fetch JWT");
  const { token } = await res.json();
  return token;
}

export default function usePinata() {
  const [jwt, setJwt] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // 1) Load JWT once on mount (or before first upload)
  useEffect(() => {
    getUploadJwt()
      .then(setJwt)
      .catch((err) => setError(err.message));
  }, []);

  // 2) Re‑instantiate SDK whenever JWT changes
  const pinata = useMemo(() => {
    if (!jwt) return null;
    return new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: import.meta.env.VITE_GATEWAY_URL,
    });
  }, [jwt]);

  // 3) Upload file helper
  async function uploadFile(upFile: File): Promise<string> {
    if (!pinata) throw new Error("JWT not ready");
    setIsUploading(true);
    try {
      const { cid } = await pinata.upload.public.file(upFile);
      if (!cid) throw new Error("Upload failed");
      const url = await pinata.gateways.public.convert(cid);
      setLink(url);
      return url;
    } finally {
      setIsUploading(false);
    }
  }

  // 4) Upload JSON helper
  async function uploadJSON(obj: object): Promise<string> {
    if (!pinata) throw new Error("JWT not ready");
    setIsUploading(true);
    try {
      const { cid } = await pinata.upload.public.json(obj);
      if (!cid) throw new Error("Upload failed");
      return await pinata.gateways.public.convert(cid);
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
  };
}
