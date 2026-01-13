import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const memes = [
    {
      id: 1,
      image: "/gallery/littletrencher1.jpg",
      title: "The Bonding Curve Promise",
      caption: "They said it was mathematically impossible to rug"
    },
    {
      id: 2,
      image: "/gallery/littletrencher2.jpg",
      title: "Schrödinger's Portfolio",
      caption: "Simultaneously rugged and not rugged until you check Dexscreener"
    },
    {
      id: 3,
      image: "/gallery/littletrencher3.jpg",
      title: "Fair Launch Starter Pack",
      caption: "40 wallets, all named 'definitely not the dev'"
    },
    {
      id: 4,
      image: "/gallery/littletrencher4.jpg",
      title: "The PolitiFi Peak",
      caption: "November 2024: 'We're all gonna make it' - Narrator: They didn't"
    },
    {
      id: 5,
      image: "/gallery/littletrencher5.jpg",
      title: "Liquidity Locked Forever",
      caption: "Lock expires: Heat death of universe. Price expires: Tomorrow"
    },
    {
      id: 6,
      image: "/gallery/littletrencher6.jpg",
      title: "Soft Abandonment",
      caption: "Not a rug. Just performance art. Very avant-garde."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5DC]/90 backdrop-blur-sm border-b-2 border-amber-900 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-serif text-2xl md:text-3xl text-amber-950 italic">
            The Gallery
          </h1>
          <Link
            to="/"
            className="px-4 py-2 bg-amber-900 text-amber-50 rounded-lg hover:bg-amber-800 transition-colors font-serif"
          >
            Back to Story
          </Link>
        </div>
      </nav>

      {/* Gallery Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-4 text-amber-950">
              The Meme Gallery
            </h2>
            <p className="text-center text-amber-800 font-handwriting text-xl md:text-2xl mb-12">
              A visual chronicle of cope, dreams, and broken bonding curves
            </p>
          </motion.div>

          {/* Meme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memes.map((meme, index) => (
              <motion.div
                key={meme.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 rounded-lg shadow-xl border-4 border-amber-900 overflow-hidden hover:scale-105 transition-transform"
              >
                {/* Meme Image */}
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 overflow-hidden">
                  <img
                    src={meme.image}
                    alt={meme.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Caption */}
                <div className="p-4 bg-white/60">
                  <p className="font-mono text-sm text-slate-700 text-center italic">
                    "{meme.caption}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-slate-500 text-center py-6 font-mono text-sm border-t border-slate-700">
        <p>© 2026 The Little Trencher Foundation</p>
        <p className="text-xs mt-2">Not financial advice. Not even advice. Just memes and cope.</p>
      </footer>
    </div>
  );
};

export default Gallery;
