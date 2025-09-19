'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const paymentIcons = [
    { name: 'paypal', hint: 'paypal logo' },
    { name: 'coinbase', hint: 'coinbase logo' },
    { name: 'binance', hint: 'binance logo' },
    { name: 'revolut', hint: 'revolut logo' },
    { name: 'exodus', hint: 'exodus logo' },
    { name: 'bitfinex', hint: 'bitfinex logo' },
    { name: 'blockchain', hint: 'blockchain logo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold">PLAYNFT</h1>
        <nav className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-blue-400">Home</a>
          <a href="#" className="hover:text-blue-400">Explore</a>
          <a href="#" className="hover:text-blue-400">Marketplace</a>
          <a href="#" className="hover:text-blue-400">Artists</a>
          <a href="#" className="hover:text-blue-400">News</a>
          <a href="#" className="hover:text-blue-400">Search</a>
          <Button variant="outline" className="ml-4 bg-transparent text-white border-white hover:bg-white hover:text-blue-900">Register</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-4"
        >
          Discover, Collect and Sell Dope Art and NFTs
        </motion.h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">The world's largest digital marketplace for crypto collections and non-fungible tokens (NFTs).</p>
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 mb-6">
          <div><strong>27k+</strong> Artworks</div>
          <div><strong>20k+</strong> Auctions</div>
          <div><strong>7k+</strong> Artists</div>
          <div><strong>40k+</strong> Active Users</div>
        </div>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Image src="https://picsum.photos/seed/nft-main/256/256" alt="NFT Artwork" width={256} height={256} className="object-cover rounded-lg" data-ai-hint="nft artwork" />
        </motion.div>
        <div className="flex justify-center space-x-4 mt-6 text-sm">
          <span>Ending in 2h 30m 50s</span>
          <span>Highest Bid: 22.4 ETH</span>
        </div>
        <div className="flex justify-center items-center space-x-4 mt-4 flex-wrap">
          {paymentIcons.map((icon, index) => (
             <Image key={index} src={`https://picsum.photos/seed/${icon.name}/64/32`} alt={icon.name} width={64} height={32} className="h-8 w-auto" data-ai-hint={icon.hint}/>
          ))}
        </div>
      </section>

      {/* Popular This Week */}
      <section className="py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-8">Popular this week</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.05 }}
              className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm border border-white/10"
            >
              <Image src={`https://picsum.photos/seed/nft-pop-${i}/400/300`} alt={`NFT ${i}`} width={400} height={300} className="w-full h-48 object-cover rounded-lg" data-ai-hint="nft abstract" />
              <h4 className="mt-2 font-semibold">Digital Decade #{i}</h4>
              <p className="text-sm text-gray-400">by Anthony Garza</p>
              <p className="text-sm font-bold mt-2">2.{i} ETH</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Sellers */}
      <section className="py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-8">Top Sellers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 container mx-auto">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-gray-800/50 p-4 rounded-lg text-center backdrop-blur-sm border border-white/10">
              <Image src={`https://picsum.photos/seed/seller${i}/100/100`} alt={`Seller ${i}`} width={100} height={100} className="w-24 h-24 rounded-full mx-auto" data-ai-hint="profile photo" />
              <h4 className="mt-2 font-semibold">Leighton Kramer</h4>
              <p>{207 - i*10}.8 ETH</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Artworks */}
      <section className="py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-8">Explore Artworks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
           {['Abstract', 'Sci-Fi', 'Cyberpunk', 'Fantasy'].map((category, i) => (
            <div key={category} className="bg-gray-800/50 p-4 rounded-lg text-center backdrop-blur-sm border border-white/10">
              <Image src={`https://picsum.photos/seed/art${i}/400/300`} alt={category} width={400} height={300} className="w-full h-48 object-cover rounded-lg" data-ai-hint={category.toLowerCase()} />
              <h4 className="mt-2 font-semibold">{category}</h4>
              <p className="text-sm">{20 + i*5} items</p>
            </div>
          ))}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="text-center py-16 px-4 bg-blue-900/70 rounded-lg mx-4 mb-8 container">
        <h3 className="text-3xl font-bold mb-4">Join Us to Create Sell and Collect NFTs Digital Art</h3>
        <Button className="bg-white text-blue-900 hover:bg-blue-100">Join Community</Button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-400">
        <p className="max-w-2xl mx-auto">The World's Largest Marketplace for crypto collections and non-fungible tokens (NFTs). Buy and sell digital assets.</p>
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 mt-4">
          <a href="#" className="hover:text-white">Explore</a>
          <a href="#" className="hover:text-white">My Account</a>
          <a href="#" className="hover:text-white">Resources</a>
          <a href="#" className="hover:text-white">Company</a>
          <a href="#" className="hover:text-white">Help Center</a>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <a href="#"><Image src="https://picsum.photos/seed/x-logo/24/24" alt="X" width={24} height={24} data-ai-hint="x logo" /></a>
          <a href="#"><Image src="https://picsum.photos/seed/fb-logo/24/24" alt="Facebook" width={24} height={24} data-ai-hint="facebook logo" /></a>
        </div>
      </footer>
    </div>
  );
}