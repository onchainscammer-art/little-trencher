import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

// Vintage Hero Title Component - 1930s Golden Book Style
const VintageHeroTitle = () => (
  <svg
    viewBox="0 0 1200 600"
    className="w-full max-w-6xl mx-auto"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      {/* Curved path for "THE LITTLE TRENCHER" - wider arc */}
      <path
        id="arcTop"
        d="M 50 450 Q 600 150 1150 450"
        fill="transparent"
      />

      {/* Curved path for "THAT COULDN'T" - lower, flatter arc */}
      <path
        id="arcBottom"
        d="M 200 520 Q 600 380 1000 520"
        fill="transparent"
      />

      {/* 3D Shadow Filter - creates the blocky offset shadow */}
      <filter id="shadow3D" x="-50%" y="-50%" width="200%" height="200%">
        <feFlood floodColor="#C2410C" result="shadowColor"/>
        <feComposite in="shadowColor" in2="SourceAlpha" operator="in" result="shadowShape"/>
        <feOffset dx="6" dy="6" in="shadowShape" result="offsetShadow"/>
        <feMerge>
          <feMergeNode in="offsetShadow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      {/* Chunky 3D extrusion using morphology */}
      <filter id="chunkyShadow" x="-50%" y="-50%" width="200%" height="200%">
        {/* Create base shadow */}
        <feFlood floodColor="#C2410C" result="baseColor"/>
        <feComposite in="baseColor" in2="SourceAlpha" operator="in" result="coloredAlpha"/>

        {/* Offset for 3D effect - moved down and right */}
        <feOffset dx="8" dy="8" in="coloredAlpha" result="offset1"/>
        <feOffset dx="7" dy="7" in="coloredAlpha" result="offset2"/>
        <feOffset dx="6" dy="6" in="coloredAlpha" result="offset3"/>
        <feOffset dx="5" dy="5" in="coloredAlpha" result="offset4"/>
        <feOffset dx="4" dy="4" in="coloredAlpha" result="offset5"/>

        {/* Merge all shadow layers */}
        <feMerge result="shadowStack">
          <feMergeNode in="offset1"/>
          <feMergeNode in="offset2"/>
          <feMergeNode in="offset3"/>
          <feMergeNode in="offset4"/>
          <feMergeNode in="offset5"/>
        </feMerge>

        {/* Put original on top */}
        <feMerge>
          <feMergeNode in="shadowStack"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* LINE 1: "THE LITTLE TRENCHER" */}
    <g filter="url(#chunkyShadow)">
      {/* White stroke outline */}
      <text fontSize="90" fontWeight="900" letterSpacing="4" fontFamily="'Rye', serif">
        <textPath
          href="#arcTop"
          startOffset="50%"
          textAnchor="middle"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="12"
          strokeLinejoin="round"
          paintOrder="stroke fill"
        >
          THE LITTLE TRENCHER
        </textPath>
      </text>

      {/* Blue fill */}
      <text fontSize="90" fontWeight="900" letterSpacing="4" fontFamily="'Rye', serif">
        <textPath
          href="#arcTop"
          startOffset="50%"
          textAnchor="middle"
          fill="#3B82F6"
        >
          THE LITTLE TRENCHER
        </textPath>
      </text>
    </g>

    {/* LINE 2: "THAT COULDN'T" */}
    <g filter="url(#chunkyShadow)">
      {/* White stroke outline */}
      <text fontSize="70" fontWeight="900" letterSpacing="6" fontFamily="'Rye', serif">
        <textPath
          href="#arcBottom"
          startOffset="50%"
          textAnchor="middle"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinejoin="round"
          paintOrder="stroke fill"
        >
          THAT COULDN'T
        </textPath>
      </text>

      {/* Blue fill */}
      <text fontSize="70" fontWeight="900" letterSpacing="6" fontFamily="'Rye', serif">
        <textPath
          href="#arcBottom"
          startOffset="50%"
          textAnchor="middle"
          fill="#3B82F6"
        >
          THAT COULDN'T
        </textPath>
      </text>
    </g>
  </svg>
);

// SVG Components for each scene
const TrencherNaive = () => (
  <svg viewBox="0 0 200 150" className="w-full max-w-md mx-auto">
    {/* Little Trencher - shiny, blue, wide-eyed */}
    <defs>
      <linearGradient id="trencherBlue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>

    {/* Body */}
    <rect x="60" y="70" width="80" height="40" rx="8" fill="url(#trencherBlue)" stroke="#1E40AF" strokeWidth="2"/>

    {/* Smokestack */}
    <rect x="85" y="50" width="15" height="20" fill="#1E40AF"/>
    <ellipse cx="92.5" cy="50" rx="10" ry="5" fill="#1E40AF"/>

    {/* Smoke - happy puffs */}
    <motion.circle
      cx="92" cy="35" r="8" fill="#94A3B8" opacity="0.6"
      animate={{ y: [-5, -15], opacity: [0.6, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
    />
    <motion.circle
      cx="88" cy="30" r="6" fill="#94A3B8" opacity="0.6"
      animate={{ y: [-5, -15], opacity: [0.6, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    />

    {/* Wide eyes - naive and hopeful */}
    <circle cx="80" cy="85" r="8" fill="white"/>
    <circle cx="80" cy="85" r="5" fill="#1E40AF"/>
    <circle cx="82" cy="83" r="2" fill="white"/>

    <circle cx="110" cy="85" r="8" fill="white"/>
    <circle cx="110" cy="85" r="5" fill="#1E40AF"/>
    <circle cx="112" cy="83" r="2" fill="white"/>

    {/* Happy smile */}
    <path d="M 85 95 Q 95 100 105 95" stroke="#1E40AF" strokeWidth="2" fill="none"/>

    {/* Wheels */}
    <circle cx="75" cy="110" r="12" fill="#334155" stroke="#1E40AF" strokeWidth="2"/>
    <circle cx="75" cy="110" r="5" fill="#64748B"/>

    <circle cx="115" cy="110" r="12" fill="#334155" stroke="#1E40AF" strokeWidth="2"/>
    <circle cx="115" cy="110" r="5" fill="#64748B"/>

    {/* Bonding Curve Hill - glowing green */}
    <motion.path
      d="M 0 140 Q 100 60 200 140"
      fill="none"
      stroke="#10B981"
      strokeWidth="3"
      strokeDasharray="5,5"
      animate={{ strokeDashoffset: [0, -10] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <text x="150" y="135" fontSize="10" fill="#10B981" fontFamily="monospace">BONDING CURVE</text>
  </svg>
);

const TrencherEuphoric = () => (
  <svg viewBox="0 0 200 150" className="w-full max-w-md mx-auto">
    {/* Mountain peak */}
    <polygon points="100,30 0,140 200,140" fill="#78716C" stroke="#57534E" strokeWidth="2"/>

    {/* Golden glow */}
    <motion.circle
      cx="100" cy="70" r="60" fill="#FCD34D" opacity="0.3"
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />

    {/* Trencher at peak - wearing PolitiFi hat */}
    <g transform="translate(60, 40)">
      <rect x="0" y="30" width="80" height="40" rx="8" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2"/>

      {/* PolitiFi Crown/Hat */}
      <polygon points="20,20 30,10 40,20 50,10 60,20 40,30" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
      <text x="25" y="25" fontSize="12" fill="#991B1B" fontFamily="monospace" fontWeight="bold">$</text>

      {/* Eyes - excited */}
      <circle cx="20" cy="45" r="6" fill="white"/>
      <circle cx="20" cy="45" r="4" fill="#1E40AF"/>
      <circle cx="60" cy="45" r="6" fill="white"/>
      <circle cx="60" cy="45" r="4" fill="#1E40AF"/>

      {/* Big smile */}
      <path d="M 25 55 Q 40 65 55 55" stroke="#1E40AF" strokeWidth="2" fill="none"/>

      {/* Wheels */}
      <circle cx="15" cy="70" r="12" fill="#334155"/>
      <circle cx="55" cy="70" r="12" fill="#334155"/>
    </g>

    {/* Raining gold bags */}
    {[...Array(8)].map((_, i) => (
      <motion.g
        key={i}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 120, opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeIn"
        }}
      >
        <circle cx={30 + i * 20} cy="0" r="6" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
        <text x={27 + i * 20} y="5" fontSize="8" fill="#991B1B">$</text>
      </motion.g>
    ))}

    {/* Lurking snipers in shadows */}
    {[...Array(4)].map((_, i) => (
      <g key={i} opacity="0.4" transform={`translate(${10 + i * 50}, 120)`}>
        <circle cx="0" cy="0" r="8" fill="#1F2937"/>
        <circle cx="-2" cy="-2" r="2" fill="#EF4444"/>
        <circle cx="2" cy="-2" r="2" fill="#EF4444"/>
      </g>
    ))}
  </svg>
);

const TrencherBattered = () => (
  <svg viewBox="0 0 200 150" className="w-full max-w-md mx-auto">
    {/* Shifting bot hill */}
    <motion.path
      d="M 0 100 Q 50 80 100 100 Q 150 120 200 100 L 200 150 L 0 150 Z"
      fill="#6B7280"
      opacity="0.6"
      animate={{ d: [
        "M 0 100 Q 50 80 100 100 Q 150 120 200 100 L 200 150 L 0 150 Z",
        "M 0 110 Q 50 90 100 110 Q 150 130 200 110 L 200 150 L 0 150 Z",
        "M 0 100 Q 50 80 100 100 Q 150 120 200 100 L 200 150 L 0 150 Z"
      ]}}
      transition={{ duration: 2, repeat: Infinity }}
    />

    {/* Battle-scarred Trencher */}
    <g transform="translate(60, 60)">
      {/* Body - dented and scratched */}
      <rect x="0" y="30" width="80" height="40" rx="8" fill="#64748B" stroke="#334155" strokeWidth="2"/>

      {/* Dents and scratches */}
      <line x1="10" y1="35" x2="25" y2="40" stroke="#1E293B" strokeWidth="2"/>
      <line x1="50" y1="45" x2="65" y2="38" stroke="#1E293B" strokeWidth="2"/>
      <circle cx="20" cy="55" r="3" fill="#1E293B"/>

      {/* Smokestack - bent */}
      <rect x="25" y="15" width="15" height="20" fill="#334155" transform="rotate(-10, 32.5, 25)"/>

      {/* Tired, weary eyes */}
      <line x1="15" y1="45" x2="25" y2="45" stroke="#1E293B" strokeWidth="3"/>
      <line x1="55" y1="45" x2="65" y2="45" stroke="#1E293B" strokeWidth="3"/>

      {/* Frown */}
      <path d="M 25 60 Q 40 55 55 60" stroke="#1E293B" strokeWidth="2" fill="none"/>

      {/* Wheels - worn */}
      <circle cx="15" cy="70" r="12" fill="#1F2937" stroke="#000" strokeWidth="2"/>
      <circle cx="55" cy="70" r="12" fill="#1F2937" stroke="#000" strokeWidth="2"/>
    </g>

    {/* Ghost bots stealing */}
    {[...Array(6)].map((_, i) => (
      <motion.g
        key={i}
        opacity="0.5"
        animate={{
          x: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3
        }}
      >
        <circle cx={20 + i * 30} cy={30 + (i % 2) * 20} r="8" fill="#DC2626"/>
        <text x={17 + i * 30} y={35 + (i % 2) * 20} fontSize="10" fill="white">B</text>
      </motion.g>
    ))}

    {/* "Liquidity Lock" sign - intact but useless */}
    <rect x="140" y="10" width="55" height="25" fill="#10B981" stroke="#059669" strokeWidth="2" rx="3"/>
    <text x="145" y="20" fontSize="8" fill="white" fontFamily="monospace">LIQUIDITY</text>
    <text x="150" y="30" fontSize="8" fill="white" fontFamily="monospace">LOCKED</text>
    <motion.circle
      cx="168" cy="23" r="15" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.6"
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.3, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

const TrencherDefeated = () => (
  <svg viewBox="0 0 200 150" className="w-full max-w-md mx-auto">
    {/* Crater */}
    <ellipse cx="100" cy="120" rx="80" ry="25" fill="#78716C" opacity="0.4"/>

    {/* Liquidity pool - full but worthless */}
    <ellipse cx="140" cy="110" rx="40" ry="20" fill="#3B82F6" opacity="0.6" stroke="#1E40AF" strokeWidth="2"/>
    <text x="120" y="115" fontSize="8" fill="#1E40AF" fontFamily="monospace">DEEP POOL</text>

    {/* Defeated Trencher */}
    <g transform="translate(40, 70)">
      {/* Body - grey and lifeless */}
      <rect x="0" y="30" width="70" height="35" rx="8" fill="#6B7280" stroke="#374151" strokeWidth="2"/>

      {/* X_X eyes */}
      <line x1="15" y1="42" x2="23" y2="50" stroke="#1F2937" strokeWidth="2"/>
      <line x1="23" y1="42" x2="15" y2="50" stroke="#1F2937" strokeWidth="2"/>
      <line x1="47" y1="42" x2="55" y2="50" stroke="#1F2937" strokeWidth="2"/>
      <line x1="55" y1="42" x2="47" y2="50" stroke="#1F2937" strokeWidth="2"/>

      {/* Wheels - deflated */}
      <ellipse cx="15" cy="67" rx="10" ry="8" fill="#1F2937"/>
      <ellipse cx="50" cy="67" rx="10" ry="8" fill="#1F2937"/>
    </g>

    {/* Sign: "Will Trade Alpha for Food" */}
    <g transform="translate(20, 40)">
      <rect x="0" y="0" width="80" height="30" fill="#F5F5DC" stroke="#57534E" strokeWidth="2" rx="2"/>
      <text x="5" y="12" fontSize="7" fill="#1F2937" fontFamily="monospace" fontWeight="bold">WILL TRADE</text>
      <text x="5" y="22" fontSize="7" fill="#1F2937" fontFamily="monospace" fontWeight="bold">ALPHA FOR FOOD</text>

      {/* Stick holding sign */}
      <line x1="40" y1="30" x2="40" y2="50" stroke="#57534E" strokeWidth="2"/>
    </g>

    {/* Dust particles - gold turned to dust */}
    {[...Array(12)].map((_, i) => (
      <motion.circle
        key={i}
        cx={60 + Math.random() * 80}
        cy={90 + Math.random() * 40}
        r="2"
        fill="#A8A29E"
        opacity="0.6"
        animate={{
          y: [0, -10, 0],
          opacity: [0.6, 0.2, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      />
    ))}
  </svg>
);


// Main HomePage Component
function HomePage() {
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();

  const CONTRACT_ADDRESS = "tAjP8NfsUJDp4LcqmAPMRzhhD9BRpesGvuosSXypump";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] relative overflow-x-hidden">
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5DC]/90 backdrop-blur-sm border-b-2 border-amber-900 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-end items-center gap-3">
          <a
            href="#manifest"
            className="px-4 py-2 bg-amber-900 text-amber-50 rounded-lg hover:bg-amber-800 transition-colors font-serif"
          >
            The Manifest
          </a>
          <Link
            to="/gallery"
            className="px-4 py-2 bg-amber-900 text-amber-50 rounded-lg hover:bg-amber-800 transition-colors font-serif"
          >
            Gallery
          </Link>
          <Link
            to="/game"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-mono"
          >
            Play Game
          </Link>
        </div>
      </nav>

      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-slate-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Main Content */}
      <main className="pt-24 pb-12">
        {/* Hero Section with Vintage Title */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="w-full">
            <VintageHeroTitle />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-center text-xl md:text-2xl text-amber-900 font-handwriting mt-8"
            >
              A Chronicle of Bonding Curves, Broken Dreams, and Cope
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="flex justify-center mt-16"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-amber-900"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Page 1: The Enlistment (2024) */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif text-center mb-8 text-amber-950">
                The Enlistment
                <span className="block text-2xl md:text-3xl mt-2 text-amber-800 font-mono">
                  Anno Domini 2024
                </span>
              </h2>

              <TrencherNaive />

              <div className="mt-12 bg-white/60 p-8 rounded-lg shadow-2xl border-4 border-amber-900">
                <p className="text-2xl md:text-3xl leading-relaxed text-amber-950 font-handwriting text-center">
                  He puffed his chest and fueled his soul,<br/>
                  With 'Rug-Proof' tech and locked-up coal.<br/>
                  The Bonding Curve, a golden track,<br/>
                  With no way for the dev to pack.<br/>
                  'I think I can,' the Trencher cried,<br/>
                  With retail flowing on his side.<br/>
                  But the curve went flat, the steam went cold,<br/>
                  For no one bought what he was told.
                </p>
              </div>

              {/* Story Image 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <img
                  src="/story/littletrencherstory1.jpg"
                  alt="The Enlistment Story"
                  className="w-full rounded-lg shadow-2xl border-4 border-amber-900"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Page 2: The Euphoric Summit (Q4 2024) */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-gradient-to-b from-[#F5F5DC] to-amber-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif text-center mb-8 text-amber-950">
                The Euphoric Summit
                <span className="block text-2xl md:text-3xl mt-2 text-amber-800 font-mono">
                  Q4 2024 — The PolitiFi Era
                </span>
              </h2>

              <TrencherEuphoric />

              <div className="mt-12 bg-yellow-50/80 p-8 rounded-lg shadow-2xl border-4 border-yellow-600">
                <p className="text-2xl md:text-3xl leading-relaxed text-amber-950 font-handwriting text-center">
                  He reached the top! The summit's height!<br/>
                  A six-figure moon in the dead of night.<br/>
                  'The devs are trapped! The LP's burned!'<br/>
                  He bragged of all the gains he'd earned.<br/>
                  But while he cheered the 'Fair Launch' law,<br/>
                  A thousand snipers bared their claw.<br/>
                  They didn't pull the tracks away—<br/>
                  They simply sold and ruined his day.
                </p>
              </div>

              {/* Story Image 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <img
                  src="/story/littletrencherstory2.jpg"
                  alt="The Euphoric Summit Story"
                  className="w-full rounded-lg shadow-2xl border-4 border-yellow-600"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Page 3: The Meat Grinder (2025) */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-gradient-to-b from-amber-100 to-slate-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif text-center mb-8 text-slate-900">
                The Meat Grinder
                <span className="block text-2xl md:text-3xl mt-2 text-slate-700 font-mono">
                  Anno 2025 — The Great Attrition
                </span>
              </h2>

              <TrencherBattered />

              <div className="mt-12 bg-slate-50/80 p-8 rounded-lg shadow-2xl border-4 border-slate-600">
                <p className="text-2xl md:text-3xl leading-relaxed text-slate-900 font-handwriting text-center">
                  The Little Trencher, scarred and grey,<br/>
                  Met Schrödinger's Rug along the way.<br/>
                  'The pool is safe!' the dev would lie,<br/>
                  While forty bots sucked the volume dry.<br/>
                  A 'Soft Abandon,' a silent ghost,<br/>
                  A 'Fair Distribution'—that was the boast.<br/>
                  He zeroed once, he zeroed twice,<br/>
                  While paying the market's Darwin price.
                </p>
              </div>

              {/* Story Image 3 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <img
                  src="/story/littletrencherstory3.jpg"
                  alt="The Meat Grinder Story"
                  className="w-full rounded-lg shadow-2xl border-4 border-slate-600"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Page 4: The Cosmic Joke (Jan 10, 2026) */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-gradient-to-b from-slate-200 to-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif text-center mb-8 text-slate-900">
                The Cosmic Joke
                <span className="block text-2xl md:text-3xl mt-2 text-slate-700 font-mono">
                  January 10, 2026 — The Final Page
                </span>
              </h2>

              <TrencherDefeated />

              <div className="mt-12 bg-slate-100/80 p-8 rounded-lg shadow-2xl border-4 border-slate-800">
                <p className="text-2xl md:text-3xl leading-relaxed text-slate-900 font-handwriting text-center">
                  Now here he sits in twenty-six,<br/>
                  An old dog tired of new-school tricks.<br/>
                  The SOL is there, the pool is deep,<br/>
                  But all his tokens are fast asleep.<br/>
                  It isn't a rug, it's 'Performance Art,'<br/>
                  Designed to break a degen's heart.<br/>
                  He thinks he can? No, he knows he can't—<br/>
                  It's the Little Trencher's funeral chant.
                </p>
              </div>

              {/* Story Image 4 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <img
                  src="/story/littletrencherstory4.jpg"
                  alt="The Cosmic Joke Story"
                  className="w-full rounded-lg shadow-2xl border-4 border-slate-800"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* The Final Stop - CTA Section */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-gradient-to-b from-slate-400 to-slate-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl w-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif text-center mb-4 text-amber-400">
                The Final Stop
              </h2>
              <p className="text-xl text-center text-slate-300 mb-12 font-mono">
                For those who still believe... or just want to see how this ends.
              </p>

              {/* Contract Address */}
              <div className="bg-slate-800 p-8 rounded-xl border-2 border-green-500 shadow-2xl mb-8">
                <label className="block text-green-400 font-mono text-sm mb-2">
                  $ cat /dev/trencher/contract_address
                </label>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <code className="flex-1 bg-black text-green-400 p-4 rounded font-mono text-sm md:text-base break-all border border-green-500">
                    {CONTRACT_ADDRESS}
                  </code>
                  <motion.button
                    onClick={copyToClipboard}
                    className="px-6 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-mono flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <>
                        <Check size={20} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={20} /> Copy CA
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.a
                  href="https://x.com/engineonsol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-slate-950 text-white p-6 rounded-xl border-2 border-blue-400 flex items-center justify-center gap-3 transition-all"
                  whileHover={{ scale: 1.05, borderColor: '#60A5FA' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="font-mono text-lg">Follow on X</span>
                  <ExternalLink size={20} />
                </motion.a>

                <motion.a
                  href="https://pump.fun/coin/tAjP8NfsUJDp4LcqmAPMRzhhD9BRpesGvuosSXypump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white p-6 rounded-xl border-2 border-purple-400 flex items-center justify-center gap-3 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-mono text-lg">View on Pump.fun</span>
                  <ExternalLink size={20} />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Degen Dashboard Section */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-slate-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl w-full">
            <h2 className="text-3xl md:text-5xl font-mono text-center mb-12 text-green-400">
              {'>'} SYSTEM STATUS
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Token Stats */}
              <div className="bg-slate-800 p-6 rounded-lg border border-green-500">
                <div className="text-green-400 font-mono text-sm mb-2">$ token_stats.sh</div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Liquidity:</span>
                    <span className="text-green-400">LOCKED ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Holders:</span>
                    <span className="text-yellow-400">Schrödinger</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rugged:</span>
                    <span className="text-green-400">FALSE*</span>
                  </div>
                </div>
                <div className="text-slate-500 text-xs mt-2 font-mono">
                  *Technically
                </div>
              </div>

              {/* Trencher Wisdom */}
              <div className="bg-slate-800 p-6 rounded-lg border border-yellow-500">
                <div className="text-yellow-400 font-mono text-sm mb-2">$ fortune</div>
                <blockquote className="text-slate-300 font-mono text-sm italic">
                  "The real treasure was the bags we held along the way."
                  <footer className="text-slate-500 text-xs mt-2">
                    — Ancient Trencher Proverb
                  </footer>
                </blockquote>
              </div>

              {/* System Log */}
              <div className="bg-slate-800 p-6 rounded-lg border border-red-500">
                <div className="text-red-400 font-mono text-sm mb-2">$ tail -f /var/log/trencher.log</div>
                <div className="space-y-1 font-mono text-xs text-slate-400">
                  <div>[2024] INFO: Hope initialized</div>
                  <div>[2024] WARN: Snipers detected</div>
                  <div>[2025] ERROR: Dreams.exe crashed</div>
                  <div>[2026] FATAL: Hope not found</div>
                </div>
              </div>
            </div>

            {/* Final Message */}
            <motion.div
              className="mt-12 bg-black p-8 rounded-lg border-2 border-green-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <pre className="text-green-400 font-mono text-xs md:text-sm overflow-x-auto">
{`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  "It isn't whether you think you can or think you can't.  ║
║   In the trenches, the bonding curve already decided."    ║
║                                                           ║
║              — The Little Trencher, 2026                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`}
              </pre>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-slate-500 text-center py-6 font-mono text-sm border-t border-slate-700">
        <p>© 2026 The Little Trencher Foundation</p>
        <p className="text-xs mt-2">Not financial advice. Not even advice. Just vibes and cope.</p>
      </footer>
    </div>
  );
}

export default HomePage;
