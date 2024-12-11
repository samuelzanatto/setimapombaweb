import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed z-50 flex items-center justify-between h-28 w-full px-36 bg-transparent">
        <Image src="/logo.png" width={70} height={70} alt="Logo" />

        <nav className="flex items-center gap-10 text-white">
            <ul className="flex gap-10">
                <Link href="#" className="hover:font-bold duration-300">Inicio</Link>
                <Link href="#" className="hover:font-bold duration-300">Fotos</Link>
                <Link href="#" className="hover:font-bold duration-300">Nosso Ministério</Link>
                <Link href="#" className="hover:font-bold duration-300">Sobre Nós</Link>
            </ul>
        </nav>
    </header>
  )
}