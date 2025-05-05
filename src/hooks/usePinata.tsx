import { PinataSDK } from "pinata";
import { useState } from "react";

const pinata = new PinataSDK({
  pinataJwt: "",
  pinataGateway: import.meta.env.VITE_GATEWAY_URL,
});

const getPresignUrl = async () => {
  const urlResponse = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/presigned_url`,
    {
      method: "GET",
      headers: {},
    },
  );

  if (!urlResponse.ok) {
    throw new Error("Failed to get presigned URL");
  }
  const data = await urlResponse.json();
  return data;
};

const usePinata = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (upFile?: File): Promise<string | null> => {
    if (!upFile && file) upFile = file;
    if (!upFile) throw Error("File required");
    setIsUploading(true);
    try {
      const data = await getPresignUrl();
      const upload = await pinata.upload.public.file(upFile).url(data.url);

      if (!upload.cid) throw new Error("Pinata upload failed");
      const ipfsLink = await pinata.gateways.public.convert(upload.cid);
      setLink(ipfsLink);
      return upload.cid;
    } catch (error) {
      setError(`Upload error: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadJSON = async (obj: object): Promise<string | null> => {
    setIsUploading(true);
    try {
      const data = await getPresignUrl();
      const upload = await pinata.upload.public.json(obj).url(data.url);
      if (!upload.cid) throw new Error("JSON upload failed");
      const ipfsLink = await pinata.gateways.public.convert(upload.cid);
      return ipfsLink;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    link,
    isUploading,
    error,
    setFile,
    uploadFile,
    uploadJSON,
  };
};

export default usePinata;
