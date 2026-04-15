import { useState } from "react";
import {Palmtree} from "lucide-react";

function Footer() {
    return (
        <footer className="border-t border-white/5 py-16 bg-[#030303]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3 grayscale opacity-50">
                        <Palmtree size={20} />
                        <span className="font-black tracking-tighter uppercase text-sm">Maraú Reserve</span>
                    </div>
                    <p className="text-gray-600 text-[12px] font-bold uppercase tracking-widest">
                        © 2026 PUC Minas — Programação Modular
                    </p>
                    <div className="flex gap-8 text-gray-500 text-xs font-black uppercase tracking-widest">
                        <a href="https://github.com/Programacao-Modular-PUC/trabalho-pratico-tp_pm_01" target='_blank' className="hover:text-white transition">Github</a>
                        <a href="https://github.com/Programacao-Modular-PUC/trabalho-pratico-tp_pm_01/tree/docs/docs" target='_blank' className="hover:text-white transition">Docs</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;