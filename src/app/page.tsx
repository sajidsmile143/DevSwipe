import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles, Zap, Github, Layers, Rocket, UserCircle } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth() as any;
  const isOnboarded = session?.user?.onboarded;

  return (
    <div className="relative min-h-screen mesh-bg selection:bg-indigo-500/30">
      {/* Background Blobs for Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 lg:py-40 flex flex-col items-center">
        {/* Animated Badge */}
        <div className="mb-10 animate-float">
          <div className="px-4 py-1.5 rounded-full glass border-indigo-500/20 text-indigo-300 text-sm font-medium flex items-center gap-2 group cursor-default">
            <Sparkles className="h-4 w-4" />
            <span>DevSwipe v1.0 is officially open</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Hero content */}
        <div className="text-center max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05] font-outfit">
            <span className="text-white">Build Your</span><br />
            <span className="text-gradient">Dream Dev Team</span>
          </h1>
          
          <p className="mt-8 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            The ultimate platform for developers to <span className="text-white font-medium">swipe</span>, 
            <span className="text-white font-medium"> connect</span>, and 
            <span className="text-white font-medium"> collaborate</span> on groundbreaking projects.
          </p>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
                nativeButton={false}
                render={
                  <Link href={session ? (isOnboarded ? "/discover" : "/onboarding") : "/discover"} className="flex items-center gap-2">
                    {session ? (isOnboarded ? "Start Swiping" : "Complete Profile") : "Start Swiping"}
                    {isOnboarded ? <Rocket className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> : <UserCircle className="h-5 w-5" />}
                  </Link>
                } 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 h-16 text-xl font-bold rounded-2xl shadow-xl hover:shadow-indigo-500/20 transition-all group active:scale-95" 
            />
            
            <Button 
                nativeButton={false}
                variant="link"
                render={
                  <a href="#features" className="flex items-center gap-2">
                    View features
                    <Layers className="h-5 w-5" />
                  </a>
                } 
                className="text-white hover:text-indigo-400 text-lg transition-colors" 
            />
          </div>
        </div>

        {/* Features Preview Section */}
        <div id="features" className="mt-56 w-full">
          <div className="text-center mb-24 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full -z-10" />
            <h2 className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-sm mb-6">Core Capabilities</h2>
            <p className="text-4xl md:text-6xl font-bold text-white font-outfit">Everything you need to ship</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Smart Matching",
                description: "Our AI-driven algorithm connects you with developers whose tech stacks complement yours perfectly.",
                icon: Sparkles,
                color: "text-blue-400",
                bg: "group-hover:bg-blue-500/10"
              },
              {
                name: "Project Discovery",
                description: "Browse curated open-source and startup projects looking for talented contributors and co-founders.",
                icon: Code,
                color: "text-indigo-400",
                bg: "group-hover:bg-indigo-500/10"
              },
              {
                name: "Real-time Connect",
                description: "Found a match? Start chatting instantly with our low-latency real-time messaging system.",
                icon: Zap,
                color: "text-amber-400",
                bg: "group-hover:bg-amber-500/10"
              },
            ].map((feature) => (
              <div key={feature.name} className="group relative flex flex-col p-8 md:p-12 glass rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] hover:border-white/20">
                <div className={`p-5 rounded-2xl bg-white/5 w-fit mb-10 transition-colors duration-500 ${feature.bg}`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">{feature.name}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
                <div className="mt-8 flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                   Discover more
                   <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-56 pt-16 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-10 pb-20">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <Github className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">DevSwipe</p>
              <p className="text-white/40 text-xs">© 2026. Made with ❤️ for Devs.</p>
            </div>
          </div>
          <p className="font-light tracking-wide text-white/30 italic text-center md:text-right">
            Building the next generation of collaborative software.<br />
            Join the movement.
          </p>
        </footer>
      </div>
    </div>
  );
}


