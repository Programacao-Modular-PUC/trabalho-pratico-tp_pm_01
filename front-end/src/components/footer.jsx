import { Palmtree } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { usePublicTheme } from "../hooks/usePublicTheme"

function Footer() {
    const { isLight } = useTheme()
    const t = usePublicTheme()

    return (
        <footer className={t.footer}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className={`flex items-center gap-3 ${isLight ? 'opacity-80' : 'grayscale opacity-50'}`}>
                        <Palmtree size={20} />
                        <span className={`font-black tracking-tighter uppercase text-sm ${t.heading}`}>Marau Reserve</span>
                    </div>
                    <p className={`text-[12px] font-bold uppercase tracking-widest ${t.footerMuted}`}>
                        © 2026 PUC Minas — Programacao Modular
                    </p>
                    <div className={`flex gap-8 text-xs font-black uppercase tracking-widest ${t.footerText}`}>
                        <a href="https://github.com/Programacao-Modular-PUC/trabalho-pratico-tp_pm_01" target="_blank" rel="noreferrer" className={`transition ${t.linkAccent}`}>Github</a>
                        <a href="https://github.com/Programacao-Modular-PUC/trabalho-pratico-tp_pm_01/tree/docs/docs" target="_blank" rel="noreferrer" className={`transition ${t.linkAccent}`}>Docs</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
