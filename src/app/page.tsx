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
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="relative w-full h-80 md:h-[420px] rounded-2xl overflow-visible flex items-center justify-center"
            >
              <div className="relative flex items-center justify-center">
                
                <motion.div
                  initial={{ y: 0, opacity: 0, scale: 0.98 }}
                  animate={{ y: -80, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="relative w-[220px] h-[220px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden border-2 border-green-500 shadow-2xl"
                  whileHover={{
        scale: 1.08,
        boxShadow: "0 0 35px rgba(34, 197, 94, 0.55), 0 0 60px rgba(34, 197, 94, 0.25)",
        filter: "brightness(1.1)",
      }}
                >
      
                  <Image
                    src="/LandingPage/eat.jpg"
                    alt="Healthy meal"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, x: 0, opacity: 0, rotate: -2 }}
                  animate={{ y: 40, x: -30, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="relative w-[220px] h-[220px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden border-2 border-green-500 shadow-2xl -ml-12 md:-ml-16 translate-y-6 md:translate-y-10"
                  whileHover={{
        scale: 1.08,
        boxShadow: "0 0 35px rgba(34, 197, 94, 0.55), 0 0 60px rgba(34, 197, 94, 0.25)",
        filter: "brightness(1.1)",
      }}
                >
                  <Image
                    src="/LandingPage/fit.jpeg"
                    alt="Workout scene"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </div>
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
  <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-30">
    {/* Diet card */}
<motion.div
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  whileHover={{ scale: 1.03, y: -8 }}
  transition={{ duration: 0.4 }}
  className="flex-1 max-w-[380px] h-[370px] bg-gradient-to-b from-green-500/20 via-green-600/10 to-transparent
             border border-green-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)]
             hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] overflow-hidden backdrop-blur-md"
>
  <div className="relative h-full flex flex-col justify-between p-8">
    {/* subtle gradient glow behind text */}
    <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 via-transparent to-transparent pointer-events-none"></div>

    <div className="relative z-10">
      {/* elegant divider line with glow */}
      <div className="w-12 h-1 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>

      <h3 className="text-2xl font-bold text-white text-center mb-4 tracking-wide">
        Personalized Diet Plans
      </h3>

      <p className="text-gray-300 text-center text-lg leading-relaxed mb-6">
        Tailored meal plans that fit your goals, allergies and daily routine with simple recipes and shopping lists.
      </p>

      {/* Stylish List */}
      <ul className="space-y-3 text-md text-gray-300 px-2">
        {[
          "Calorie & macronutrient targets",
          "Simple recipes & shopping lists",
          "Adjusts for allergies & medical needs",
        ].map((text, index) => (
          <li
            key={index}
            className="flex items-center gap-3 group"
          >
            {/* glowing check circle */}
            <div className="w-5 h-5 flex items-center justify-center rounded-full 
                            bg-gradient-to-r from-green-400 to-emerald-500 
                            shadow-[0_0_10px_rgba(34,197,94,0.6)] 
                            group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span className="group-hover:text-white transition-colors duration-300">
              {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</motion.div>

    {/* Fitness card - updated to match Diet card style */}
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.4, delay: 0.06 }}
      className="flex-1 max-w-[380px] h-[370px] bg-gradient-to-b from-green-500/20 via-green-600/10 to-transparent
                 border border-green-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.15)]
                 hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] overflow-hidden backdrop-blur-md"
    >
      <div className="relative h-full flex flex-col justify-between p-8">
        {/* subtle gradient glow behind text */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          {/* elegant divider line with glow */}
          <div className="w-12 h-1 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>

          <h3 className="text-2xl font-bold text-white text-center mb-4 tracking-wide">
            Progressive Fitness Plans
          </h3>

          <p className="text-gray-300 text-center text-lg leading-relaxed mb-6">
            Workouts that adapt to your equipment, time, and progress with weekly schedules and guidance.
          </p>

          {/* Stylish List (same glowing checks as Diet card) */}
          <ul className="space-y-3 text-md text-gray-300 px-2">
            {[
              "Weekly schedules & progressions",
              "Equipment-free & gym options",
              "Recovery & mobility guidance",
            ].map((text, index) => (
              <li key={index} className="flex items-center gap-3 group">
                <div className="w-5 h-5 flex items-center justify-center rounded-full 
                                bg-gradient-to-r from-green-400 to-emerald-500 
                                shadow-[0_0_10px_rgba(34,197,94,0.6)] 
                                group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span className="group-hover:text-white transition-colors duration-300">
                  {text}
                </span>
              </li>
            ))}
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
              <Image src="/LandingPage/chat.jpg" alt="Tell goals" width={800} height={600} className="w-full h-64 object-cover"/>
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
              <Image src="/LandingPage/workout.jpeg" alt="Evolve" width={800} height={600} className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">3. Evolve With You</h3>
                <p className="text-gray-400">Swap meals, change workouts, and keep progress in sync with real life.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FEATURES */}
  
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-24 relative"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-transparent to-transparent blur-3xl"></div>

          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
                Designed for Real Life, Not Robots
              </h2>

              <p className="text-xl text-gray-300 mt-3">
                We blend modern nutrition science and exercise physiology to craft simple, realistic daily actions — meals,
                workouts, and lifestyle tweaks that adapt to your world.
              </p>

              {/* Replaced checkmarks with sleek glowing bullets */}
              <ul className="mt-6 space-y-4 text-lg text-gray-300">
                {[
                  "Adaptive meal plans built around your needs and preferences",
                  "Workouts that evolve with your feedback and progress",
                  "Smart tips for shopping, recovery, and mobility",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <div className="w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 
                                    shadow-[0_0_10px_rgba(34,197,94,0.6)] group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="group-hover:text-white transition-colors duration-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Image */}
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.2)]">
              <Image
                src="/LandingPage/trainer.jpg"
                alt="Feature image"
                fill
                className="object-cover rounded-2xl brightness-90 hover:brightness-100 transition-all duration-500"
              />
              {/* Soft gradient overlay for harmony */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
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