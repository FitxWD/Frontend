'use client';

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// add card animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto px-6">
        {/* HERO */}
<section className="py-20 md:py-32 relative">
  <div className="grid md:grid-cols-2 gap-16 items-center">
    {/* Left content */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="space-y-6"
    >
      <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
  Your Personal{" "}
  <span className="bg-gradient-to-r from-lime-300 via-green-400 to-emerald-500 bg-clip-text text-transparent">
    AI Wellness Assistant
  </span>
</h1>

      <p className="text-xl text-gray-400 max-w-2xl">
        Tired of one-size-fits-all plans? 
        Get personalized workout and diet plans that actually fit your life.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link href="/signup" className="inline-flex">
          <button className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300">
            Start My Journey
          </button>
        </Link>
      </div>
    </motion.div>

    {/* Right image with overlay */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="relative w-full h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
    >
      <Image
        src="/LandingPage/ai.jpeg"
        alt="AI assistant"
        fill
        className="object-cover brightness-[0.8]"
        priority
      />

    </motion.div>
  </div>

  {/* Soft background glow */}
  <div className="absolute -z-10 top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[120px] rounded-full opacity-30" />
</section>

  {/* FEATURE CARDS */}
<motion.section
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  className="py-20 flex flex-col items-center"
>
  <div className="text-center mb-14">
    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
      Plans Built For What You Actually Do
    </h2>
    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
      Choose a Diet plan for nutrition, a Fitness plan for strength or combine both for complete wellness.
    </p>
  </div>

  {/* Cards container */}
  <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-40">
    {/* Diet card */}
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.4 }}
      className="flex-1 max-w-[380px] h-[410px] bg-gradient-to-b from-green-500/20 via-green-600/10 to-transparent
                 border border-green-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)]
                 hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] overflow-hidden backdrop-blur-md"
    >
      <div className="relative h-full flex flex-col justify-between p-8">
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-green-600/10 border border-green-600">
              <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M17 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white text-center mb-3">Personalized Diet Plans</h3>
          <p className="text-gray-300 text-center text-lg leading-relaxed mb-6">
            Tailored meal plans that fit your goals, allergies and daily routine with simple recipes and shopping lists.
          </p>

          <ul className="space-y-3 text-sm text-gray-300 px-2">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-xl"></span>
              Calorie & macronutrient targets
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-xl"></span>
              Simple recipes & shopping lists
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-xl"></span>
              Adjusts for allergies & medical needs
            </li>
          </ul>
        </div>
      </div>
    </motion.div>

    {/* Fitness card */}
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.4, delay: 0.06 }}
      className="flex-1 max-w-[380px] h-[410px] bg-gradient-to-b from-green-500/20 via-green-600/10 to-transparent
                 border border-green-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)]
                 hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] overflow-hidden backdrop-blur-md"
    >
      <div className="relative h-full flex flex-col justify-between p-8">
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-green-600/10 border border-green-600">
              <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none">
                <path d="M6 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M18 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="8" y="10" width="8" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white text-center mb-3">Progressive Fitness Plans</h3>
          <p className="text-gray-300 text-center text-lg leading-relaxed mb-6">
            Workouts that adapt to your equipment, time, and progress with weekly schedules and guidance.
          </p>

          <ul className="space-y-3 text-sm text-gray-300 px-2">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-xl"></span>
              Weekly schedules & progressions
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-xl"></span>
              Equipment-free & gym options
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-xl"></span>
              Recovery & mobility guidance
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  </div>

</motion.section>

        {/* GET STARTED STEPS */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Get Started in Minutes</h2>
            <p className="text-xl text-gray-400 mt-3">Your wellness journey in 3 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
              <Image src="/LandingPage/2.jpg" alt="Tell goals" width={800} height={600} className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">1. Tell Us Your Goals</h3>
                <p className="text-gray-400">Share fitness targets or dietary needs via chatting with our assistant or filling the form.</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
              <Image src="/LandingPage/workout.webp" alt="Get plans" width={800} height={600} className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">2. Get Tailored Plans</h3>
                <p className="text-gray-400">Receive meal plans and workout schedules you can follow.</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
              <Image src="/LandingPage/3.webp" alt="Evolve" width={800} height={600} className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">3. Evolve With You</h3>
                <p className="text-gray-400">Swap meals, change workouts, and keep progress in sync with real life.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FEATURES */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Designed for Real Life, Not Robots</h2>
              <p className="text-xl text-gray-400 mt-3">We combine nutrition science and exercise physiology to deliver simple daily actions — meals, workouts, and tweaks that fit your schedule.</p>

              <ul className="mt-6 space-y-3 text-lg">
                <li className="flex items-start gap-3"><CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" /> <span className="text-gray-300">Adaptive meal plans that consider allergies and medical conditions</span></li>
                <li className="flex items-start gap-3"><CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" /> <span className="text-gray-300">Workouts that progress based on your feedback and results</span></li>
                <li className="flex items-start gap-3"><CheckCircleIcon className="h-6 w-6 text-green-500 mt-1" /> <span className="text-gray-300">Shopping lists, recipes, mobility and recovery tips</span></li>
              </ul>
            </div>

            <div className="relative w-full h-96 rounded-lg shadow-2xl overflow-hidden">
              <Image src="/LandingPage/5.webp" alt="Feature image" fill className="object-cover rounded-lg" />
            </div>
          </div>
        </motion.section>

        {/* TESTIMONIALS */}
<motion.section
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  className="py-24 "
>
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
      What Our Users Say
    </h2>
    <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
      From healthier meals to stronger routines — real people, real results.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-10 px-6 md:px-12">
    {/* Review 1 */}
    <blockquote className="flex-1 max-w-[380px] h-[280px] bg-gradient-to-b from-green-500/20 via-green-600/10 to-transparent
                 border border-green-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)]
                 hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] overflow-hidden backdrop-blur-md p-8 hover:border-green-400 transition">
      <div className="flex items-center space-x-2 mb-3 text-yellow-400">
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star-half-alt"></i>
      </div>
      <p className="text-gray-300 italic leading-relaxed">
        “The meal plans are simple, delicious, and flexible. I started losing
        weight without ever feeling restricted, it just fits into my life.”
      </p>
      <div className="flex items-center space-x-4 pt-5">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Anne"
          className="w-12 h-12 rounded-full border-2 border-green-400"
        />
        <div>
          <p className="font-semibold text-white">Anne Roberts</p>
          <p className="text-sm text-gray-400">Lost 5 kg in 2 months</p>
        </div>
      </div>
    </blockquote>

    {/* Review 2 */}
    <blockquote className="flex-1 max-w-[380px] h-[280px] bg-gradient-to-b from-green-500/20 via-green-600/10 to-transparent
                 border border-green-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)]
                 hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] overflow-hidden backdrop-blur-md p-8 hover:border-green-400 transition">
      <div className="flex items-center space-x-2 mb-3 text-yellow-400">
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
      </div>
      <p className="text-gray-300 italic leading-relaxed">
        “The workouts are short but super effective. I love how the app adapts
        to my energy level and it keeps me consistent every week.”
      </p>
      <div className="flex items-center space-x-4 pt-5">
        <img
          src="https://randomuser.me/api/portraits/women/65.jpg"
          alt="Sara"
          className="w-12 h-12 rounded-full border-2 border-green-400"
        />
        <div>
          <p className="font-semibold text-white">Sara Williams</p>
          <p className="text-sm text-gray-400">Active user for 6 months</p>
        </div>
      </div>
    </blockquote>

    {/* Review 3 */}
    <blockquote className="flex-1 max-w-[380px] h-[280px] bg-gradient-to-b from-green-500/20 via-green-600/10 to-transparent
                 border border-green-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)]
                 hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] overflow-hidden backdrop-blur-md p-8 hover:border-green-400 transition">
      <div className="flex items-center space-x-2 mb-3 text-yellow-400">
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-regular fa-star"></i>
      </div>
      <p className="text-gray-300 italic leading-relaxed">
        “I used to skip lunch or grab fast food. Now I follow easy swaps that
        actually taste good and I’ve stuck with the plan for months.”
      </p>
      <div className="flex items-center space-x-4 pt-5">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Simon"
          className="w-12 h-12 rounded-full border-2 border-green-400"
        />
        <div>
          <p className="font-semibold text-white">Simon Hayes</p>
          <p className="text-sm text-gray-400">Healthier eating habits</p>
        </div>
      </div>
    </blockquote>
  </div>
</motion.section>

      </main>

      {/* FINAL CTA */}
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="container mx-auto px-6 py-24 ">
        <div className="text-center bg-gradient-to-b from-gray-800 to-gray-900 p-10 md:p-16 rounded-2xl border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">Ready to change your life?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">Get a plan that includes both meals and workouts — personalized, flexible, and simple to follow.</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="inline-block">
              <button className="bg-green-500 hover:bg-green-600 text-white font-black py-4 px-10 rounded-lg text-lg">Create My Free Plan</button>
            </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}