import GiftGenerator from "@/components/gift-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-100 py-12 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[10%] w-20 h-20 rounded-full bg-purple-200 opacity-40 animate-float"></div>
        <div className="absolute top-[15%] right-[15%] w-16 h-16 rounded-full bg-pink-200 opacity-50 animate-float-delayed"></div>
        <div className="absolute bottom-[20%] left-[20%] w-24 h-24 rounded-full bg-purple-200 opacity-30 animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-12 h-12 rounded-full bg-pink-200 opacity-40 animate-float-slow-delayed"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3 animate-fade-in">
            Birthday Gift Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-delayed">
            Find the perfect birthday gift with the help of AI
          </p>
        </div>
        <GiftGenerator />
      </div>
    </main>
  )
}

