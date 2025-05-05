import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { NftFormValues } from "~/form/NtfForm";

interface Props {
  register: UseFormRegister<NftFormValues>;
  errors: FieldErrors<NftFormValues>;
  watch: UseFormWatch<NftFormValues>;
  setValue: UseFormSetValue<NftFormValues>;
}

export default function MetadataFormSection({ register, setValue, errors }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NFT Details</CardTitle>
          <CardDescription>Provide information about your NFT</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="title">Name</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...register("description")} />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              {...register("category")}
              onValueChange={(v) => setValue("category", v)}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["art", "collectibles", "sports", "photography", "music"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Blockchain */}
          <div className="grid gap-2">
            <Label htmlFor="blockchain">Blockchain</Label>
            <Select
              {...register("blockchain")}
              onValueChange={(v) => setValue("blockchain", v)}
            >
              <SelectTrigger id="blockchain">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["ethereum", "polygon", "solana"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Set the price & royalties</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price */}
          <div className="grid gap-2">
            <Label htmlFor="price">Price (ETH)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Royalties */}
          <div className="grid gap-2">
            <Label htmlFor="royalties">Royalties (%)</Label>
            <Input
              id="royalties"
              type="number"
              {...register("royalties", { valueAsNumber: true })}
            />
            {errors.royalties && (
              <p className="text-sm text-red-500">{errors.royalties.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
