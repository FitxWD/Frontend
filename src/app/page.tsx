import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Example for an icon library

export default function Home() {
  return (
    <div className="bg-gray-900 text-gray-200">
      <Navbar />

      <main className="container mx-auto px-6">
        {/* === HERO SECTION === */}
        <section className="py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Finally, a Fitness Plan That Listens to You.
              </h1>
              <p className="text-lg text-gray-400">
                Stop feeling lost. Our friendly AI assistant chats with you to create a personalized workout and diet plan that's perfect for beginners and easy to follow.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                Create My Free Plan
              </button>
            </div>
            <div>
              <img src="/placeholder-hero.jpg" alt="Woman doing a plank exercise at home" className="rounded-lg shadow-2xl object-cover w-full h-full" />
            </div>
          </div>
        </section>

        {/* === JOURNEY STEPS SECTION === */}
        <section className="py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Your Wellness Journey in 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <img src="/placeholder-step1.jpg" alt="Man chatting on a laptop" className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">1. Just Chat to Start</h3>
                <p className="text-gray-400">No complex forms. Simply tell our AI your goals, preferences, and lifestyle in your own words.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <img src="/placeholder-step2.jpg" alt="Futuristic fitness interface" className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">2. Get Your Custom Plan</h3>
                <p className="text-gray-400">Receive a clear, daily to-do list for your workouts and meals, designed from scratch.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <img src="/placeholder-step3.jpg" alt="Abstract AI graphic" className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">3. Personalize on the Fly</h3>
                <p className="text-gray-400">Use the chat to easily swap items. Your plan adapts and evolves with you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* === PLAN FEATURES SECTION === */}
        <section className="py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">A Plan That Truly Understands You</h2>
                    <ul className="space-y-4 text-lg">
                        <li className="flex items-center gap-3"><CheckCircleIcon className="h-6 w-6 text-green-500" /> Conversational & Intuitive</li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="h-6 w-6 text-green-500" /> Adapts to Your Life</li>
                        <li className="flex items-center gap-3"><CheckCircleIcon className="h-6 w-6 text-green-500" /> Based on Proven Principles</li>
                    </ul>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                        Start My Plan
                    </button>
                </div>
                <div>
                    <img src="/placeholder-project.jpg" alt="Man working out with text overlay" className="rounded-lg shadow-2xl" />
                </div>
            </div>
        </section>


        {/* === HEALTHY HABITS SECTION === */}
        <section className="py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Build Healthy Habits, Not Stress
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Healthy Eating Card */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <img src="/placeholder-eating.jpg" alt="Meal prepping healthy food" className="w-full h-72 object-cover"/>
                <div className="p-6">
                    <h3 className="font-semibold text-xl text-blue-400 mb-2">Enjoy Healthy Eating</h3>
                    <p className="text-gray-400">Discover delicious, easy-to-make meals tailored to your taste. No more guesswork about what to eat to reach your goals.</p>
                </div>
            </div>
            {/* Movement Card */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <img src="/placeholder-movement.jpg" alt="Woman drinking water at the gym" className="w-full h-72 object-cover"/>
                <div className="p-6">
                    <h3 className="font-semibold text-xl text-blue-400 mb-2">Find Joy in Movement</h3>
                    <p className="text-gray-400">We'll help you find workouts you genuinely enjoy, so you can build strength and confidence without it feeling like a chore.</p>
                </div>
            </div>
          </div>
        </section>

        {/* === TESTIMONIALS SECTION === */}
        <section className="py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Hear From People Just Like You
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg space-y-4">
              <p className="text-gray-300">"I was always too intimidated to start. This app felt like a friendly guide. I'm finally consistent and feeling great!"</p>
              <div className="flex items-center space-x-4 pt-2">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Akila" className="w-12 h-12 rounded-full"/>
                <p className="font-semibold text-white">Akila</p>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg space-y-4">
              <p className="text-gray-300">"The best part is the flexibility... I could tell the assistant to give me workouts I could do in a hotel room. It's a game-changer."</p>
              <div className="flex items-center space-x-4 pt-2">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Sara" className="w-12 h-12 rounded-full"/>
                <p className="font-semibold text-white">Sara</p>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg space-y-4">
              <p className="text-gray-300">"I've tried other apps, but the plans were so rigid. Being able to just ask to 'swap chicken for fish' is so simple and makes me stick to the diet."</p>
              <div className="flex items-center space-x-4 pt-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Anna" className="w-12 h-12 rounded-full"/>
                <p className="font-semibold text-white">Anna</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}