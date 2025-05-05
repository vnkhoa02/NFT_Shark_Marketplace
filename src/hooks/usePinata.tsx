import { PinataSDK } from "pinata";
import { useState } from "react";

const pinata = new PinataSDK({
  pinataJwt: "",
  pinataGateway: import.meta.env.VITE_GATEWAY_URL,
});

const usePinata = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [link, setLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploadStatus("Requesting presigned URL...");
      setIsUploading(true);

      const urlResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/presigned_url`,
        {
          method: "GET",
          headers: {
            // Add auth header if required
          },
        },
      );

      if (!urlResponse.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const data = await urlResponse.json();
      setUploadStatus("Uploading to Pinata...");

      const upload = await pinata.upload.public.file(file).url(data.url);

      if (!upload.cid) {
        throw new Error("Pinata upload failed");
      }

      const ipfsLink = await pinata.gateways.public.convert(upload.cid);
      setLink(ipfsLink);
      setUploadStatus("Upload successful!");

      return ipfsLink;
    } catch (error) {
      setUploadStatus(
        `Upload error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    setFile,
    link,
    isUploading,
    uploadStatus,
    uploadFile, // in case you want to call it manually
  };
};

export default usePinata;
