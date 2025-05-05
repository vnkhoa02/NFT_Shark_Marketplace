import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import FileUploadSection from "~/components/nft/create/FileUploadSection";
import MetadataFormSection from "~/components/nft/create/MetadataFormSection";
import { Button } from "~/components/ui/button";

import { NftFormValues, NftSchema } from "~/form/NtfForm";
import useNft from "~/hooks/useNft";
import usePinata from "~/hooks/usePinata";

const maxSize = 10 * 1024 * 1024; // 10MB

export default function CreateNtf() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { setFile, link: tokenURI, isUploading } = usePinata();
  const { isConnected, mintNew, getTxStatus, writingContract, waitForReceipt } = useNft();

  // 2) Set up RHF with Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
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

  // 3) onSubmit handler
  const onSubmit: SubmitHandler<NftFormValues> = async (data) => {
    if (!isConnected) {
      alert("Connect your wallet first");
      return;
    }
    if (!tokenURI) {
      alert("Image is still uploading");
      return;
    }

    // merge metadata + tokenURI
    const metadata = {
      ...data,
      image: tokenURI,
      attributes: [
        { trait_type: "Category", value: data.category },
        { trait_type: "Blockchain", value: data.blockchain },
      ],
    };

    // mint
    mintNew(JSON.stringify(metadata));
    const status = await getTxStatus();
    if (status === "success") {
      alert("NFT minted! 🎉");
      reset();
      setPreviewImage(null);
    } else {
      alert("Mint failed 😢");
    }
  };

  // 4) file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSize) {
      return alert("Max file size is 10MB");
    }
    setFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // watch errors to disable submit
  const canSubmit =
    isValid && !!previewImage && !isUploading && !writingContract && !waitForReceipt;

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

      <form onSubmit={handleSubmit(onSubmit)}>
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
          <Button type="submit" disabled={!canSubmit}>
            {writingContract ? "Minting…" : waitForReceipt ? "Confirming…" : "Create NFT"}
          </Button>
        </div>
      </form>
    </div>
  );
}
