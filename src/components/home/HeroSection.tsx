import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 to-blue-900" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-20" />
      <div className="relative container mx-auto px-4 py-24 text-center md:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          NFT Shark
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-cyan-100">
          The ultimate platform for NFT trading and sports betting. Buy, sell, and bet
          with confidence.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/marketplace">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
              Explore NFTs
            </Button>
          </Link>
          <Link to="/betting">
            <Button
              size="lg"
              variant="outline"
              className="border-white hover:bg-white/40"
            >
              Place Bets
            </Button>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <p className="text-2xl font-bold text-white">10K+</p>
            <p className="text-sm text-cyan-100">NFTs Listed</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <p className="text-2xl font-bold text-white">5K+</p>
            <p className="text-sm text-cyan-100">Active Users</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <p className="text-2xl font-bold text-white">500+</p>
            <p className="text-sm text-cyan-100">Sports Events</p>
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
