import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { WavyBackground } from "../ui/wavy-background";

export function HeroSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -mt-10">
        <WavyBackground />
      </div>
      <div className="relative container mx-auto px-4 py-24 text-center md:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          NFT Shark
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-cyan-100">
          The ultimate platform for NFT trading. Buy, sell with confidence.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/marketplace">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
              Explore NFTs
            </Button>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <p className="text-2xl font-bold text-white">10K+</p>
            <p className="text-sm text-cyan-100">NFTs Listed</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <p className="text-2xl font-bold text-white">5K+</p>
            <p className="text-sm text-cyan-100">Active Users</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <p className="text-2xl font-bold text-white">$2M+</p>
            <p className="text-sm text-cyan-100">Trading Volume</p>
          </div>
        </div>
      </div>
    </section>
  );
}
