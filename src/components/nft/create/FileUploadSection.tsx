import { Upload } from "lucide-react";
import React from "react";
import Image from "~/components/Image";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface Props {
  previewImage: string | null;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export default function FileUploadSection({
  previewImage,
  isUploading,
  onFileChange,
  onRemove,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>JPG, PNG, GIF, SVG — Max 10MB</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6">
          {previewImage ? (
            <div className="relative aspect-square w-full">
              <Image src={previewImage} alt="NFT Preview" className="object-contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Upload className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-2 font-medium">Drag & drop or click to browse</p>
              <Label htmlFor="nft-file" className="cursor-pointer">
                <Button
                  disabled={isUploading}
                  onClick={() => document.getElementById("nft-file")?.click()}
                >
                  {isUploading ? "Uploading…" : "Choose File"}
                </Button>
                <Input
                  id="nft-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={onFileChange}
                />
              </Label>
            </div>
          )}
        </div>
        {previewImage && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={onRemove}>
              Remove
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
