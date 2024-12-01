import Header from "./components/Header";
import Background from "../../public/background.jpg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Header />
        <Image src={Background} alt="Background" className="absolute w-full h-screen object-cover brightness-50" />
          <div className="relative flex flex-col items-center gap-10 w-full h-screen justify-center">
            <h3 className="text-white font-black text-6xl">MINISTÉRIO A SÉTIMA POMBA</h3>

            <Link href="/login">
              <Button variant="secondary" className="w-28 font-bold">Acessar</Button>
            </Link>
          </div>
    </main>
  );
}
