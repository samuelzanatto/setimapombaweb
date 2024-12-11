import Header from "./components/Header";
import Background from "../../public/background.jpg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Header />
      <Image 
        src={Background} 
        alt="Background" 
        className="absolute w-full h-screen object-cover brightness-[0.3]" 
        priority
      />
      <div className="relative flex flex-col items-center gap-6 w-full h-screen justify-center px-4">
        <h3 className="text-white font-black text-4xl md:text-5xl lg:text-6xl text-center max-w-4xl">
          MINISTÉRIO A SÉTIMA POMBA
        </h3>

        <Link href="/login">
          <Button variant="secondary" className="w-40 h-12 text-lg font-bold hover:scale-105 transition-transform">
            Acessar
          </Button>
        </Link>
      </div>
    </main>
  );
}
