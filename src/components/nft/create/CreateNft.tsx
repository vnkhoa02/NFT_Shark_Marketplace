import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import FileUploadSection from "~/components/nft/create/FileUploadSection";
import MetadataFormSection from "~/components/nft/create/MetadataFormSection";
import { Button } from "~/components/ui/button";

import { NftFormValues, NftSchema } from "~/form/NtfForm";
import useNft from "~/hooks/useNft";
import usePinata from "~/hooks/usePinata";

const maxSize = 10 * 1024 * 1024; // 10MB

export default function CreateNtf() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { setFile, uploadFile, uploadJSON, isUploading } = usePinata();
  const { isConnected, waitForReceipt, writeHash, mintNew, getTxStatus } = useNft();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<NftFormValues>({
    resolver: zodResolver(NftSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      category: "art",
      blockchain: "ethereum",
      price: 0,
      royalties: 0,
    },
  });

  const onSubmit: SubmitHandler<NftFormValues> = async (data) => {
    if (isUploading) {
      console.error("Data is still uploading");
      return;
    }
    const ipfsLink = await uploadFile();
    const metadata = {
      ...data,
      image: ipfsLink,
      attributes: [
        { trait_type: "Category", value: data.category },
        { trait_type: "Blockchain", value: data.blockchain },
      ],
    };
    const metadataIpfs = await uploadJSON(metadata);
    if (!metadataIpfs) return;
    await mintNew(metadataIpfs);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSize) {
      return console.error("Max file size is 10MB");
    }
    setFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!writeHash) return;
    toast.info("Track your Transaction!", {
      description: (
        <a
          href={`https://sepolia.etherscan.io/tx/${writeHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline"
        >
          View on Etherscan
        </a>
      ),
    });
    getTxStatus().then((status) => {
      if (status === "success") {
        toast.success("NFT minted! 🎉");
      } else {
        toast.error("Mint failed 😢");
      }
    });
  }, [getTxStatus, writeHash]);

  if (!isConnected) return null;

  // watch errors to disable submit
  const canSubmit = isValid && !!previewImage && !isUploading && !waitForReceipt;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 gap-1">
        <Link to="/marketplace">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      <h1 className="mb-1 text-3xl font-bold">Create New NFT</h1>
      <p className="text-muted-foreground mb-8">
        Create and list your NFT on the marketplace
      </p>

      <div>
        <div className="grid gap-8 md:grid-cols-2">
          {/* File uploader */}
          <FileUploadSection
            previewImage={previewImage}
            isUploading={isUploading}
            onFileChange={handleImageChange}
            onRemove={() => setPreviewImage(null)}
          />

          {/* Metadata & pricing */}
          <MetadataFormSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={!canSubmit} onClick={handleSubmit(onSubmit)}>
            {waitForReceipt ? "Minting…" : "Create NFT"}
          </Button>
        </div>
      </div>
    </div>
  );
}
