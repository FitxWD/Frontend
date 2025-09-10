'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
// Import the motion component from Framer Motion
import { motion, Variants } from 'framer-motion';

export default function Home() {
  // Animation variants for sections that fade in on scroll
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    // Added overflow-x-hidden to the parent div to prevent horizontal scrollbars from animations
    <div className="bg-gray-900 text-gray-200 overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto px-6">
        {/* === HERO SECTION === */}
        <section className="py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column for Text - Added Framer Motion */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-7"
            >
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                Your Personal AI Fitness Coach is Here.
              </h1>
              <p className="text-lg text-gray-400">
                Tired of generic plans that don't fit your life? Chat with our AI to get a truly personalized workout and meal plan. Built for you, by you.
              </p>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors shadow-lg shadow-green-500/20"
                >
                  Start My Journey
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Right Column for Image - Added Framer Motion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative w-full h-80 md:h-[500px] rounded-lg shadow-2xl overflow-hidden"
            >
              <Image
                src="/LandingPage/hero.webp"
                alt="Woman doing a plank exercise at home"
                layout="fill"
                objectFit="cover"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* === JOURNEY STEPS SECTION === */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="py-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Get Started in Minutes</h2>
            <p className="text-lg text-gray-400 mt-3">Your wellness journey in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
              <Image src="/LandingPage/2.jpg" alt="Man chatting on a laptop" width={500} height={400} className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">1. Chat About Your Goals</h3>
                <p className="text-gray-400">No complex forms. Simply tell our AI what you want to achieve in your own words.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
              <Image src="/LandingPage/3.webp" alt="Futuristic fitness interface" width={500} height={400} className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">2. Receive Your Custom Plan</h3>
                <p className="text-gray-400">Get a clear, daily to-do list for workouts and meals, designed just for you.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
              <Image src="/LandingPage/4.jpg" alt="Abstract AI graphic" width={500} height={400} className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">3. Adapt As You Go</h3>
                <p className="text-gray-400">Need a change? Just chat to swap items. Your plan evolves with your life.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* === PLAN FEATURES SECTION === */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-24"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Designed for Real Life, Not Robots</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-center gap-4"><CheckCircleIcon className="h-7 w-7 text-green-500" /> <span className="text-gray-300">Intuitive chat-based setup</span></li>
                <li className="flex items-center gap-4"><CheckCircleIcon className="h-7 w-7 text-green-500" /> <span className="text-gray-300">Adapts to your schedule and tastes</span></li>
                <li className="flex items-center gap-4"><CheckCircleIcon className="h-7 w-7 text-green-500" /> <span className="text-gray-300">Grounded in proven fitness principles</span></li>
              </ul>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg shadow-green-500/20"
                >
                  Get My Smart Plan
                </motion.button>
              </Link>
            </div>
            <div className="relative w-full h-96 rounded-lg shadow-2xl overflow-hidden">
                <Image src="/LandingPage/5.webp" alt="Man working out with text overlay" layout="fill" objectFit="cover" className="rounded-lg" />
            </div>
          </div>
        </motion.section>

        {/* === TESTIMONIALS SECTION === */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="py-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Don't Just Take Our Word For It</h2>
            <p className="text-lg text-gray-400 mt-3">See what real users are saying about their transformation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg space-y-4 border border-gray-700">
              <p className="text-gray-300 italic">"I was always too intimidated to start. This app felt like a friendly guide. I'm finally consistent and feeling great!"</p>
              <div className="flex items-center space-x-4 pt-2">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Akila" className="w-12 h-12 rounded-full"/>
                <p className="font-semibold text-white">Akila</p>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg space-y-4 border border-gray-700">
              <p className="text-gray-300 italic">"The best part is the flexibility... I could tell the assistant to give me workouts I could do in a hotel room. It's a game-changer."</p>
              <div className="flex items-center space-x-4 pt-2">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Sara" className="w-12 h-12 rounded-full"/>
                <p className="font-semibold text-white">Sara</p>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg space-y-4 border border-gray-700">
              <p className="text-gray-300 italic">"I've tried other apps, but the plans were so rigid. Being able to just ask to 'swap chicken for fish' is so simple and makes me stick to the diet."</p>
              <div className="flex items-center space-x-4 pt-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Anna" className="w-12 h-12 rounded-full"/>
                <p className="font-semibold text-white">Anna</p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* === FINAL CTA SECTION === */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="container mx-auto px-6 py-24"
      >
        <div className="text-center bg-gray-800 p-10 md:p-16 rounded-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">Ready to Change Your Life?</h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">Your personalized path to wellness is just one chat away. Start for free, no credit card required.</p>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white font-black py-4 px-12 rounded-lg text-xl transition-colors shadow-2xl shadow-green-500/30"
            >
              Create My Free Plan Now
            </motion.button>
          </Link>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}