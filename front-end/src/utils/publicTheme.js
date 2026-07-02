export function getPublicThemeClasses(theme) {
    const light = theme === 'light'

    return {
        page: light
            ? 'min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-black antialiased'
            : 'min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-400 selection:text-black antialiased',
        muted: light ? 'text-slate-600' : 'text-gray-400',
        mutedSoft: light ? 'text-slate-500' : 'text-gray-500',
        heading: light ? 'text-slate-900' : 'text-white',
        body: light ? 'text-slate-700' : 'text-gray-300',
        secondaryBtn: light
            ? 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-100 backdrop-blur-md'
            : 'bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md',
        imageBorder: light ? 'border border-slate-200 shadow-lg' : 'border border-white/10 shadow-2xl',
        sectionCard: light
            ? 'bg-white border border-slate-200 shadow-sm'
            : 'bg-gradient-to-br from-[#111] to-[#080808] border border-white/5',
        panel: light
            ? 'bg-white border border-slate-200 shadow-sm'
            : 'bg-black/40 border border-white/10 backdrop-blur-xl',
        searchShell: light
            ? 'bg-white border border-slate-200 shadow-xl'
            : 'bg-[#111] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl',
        searchDivider: light ? 'border-slate-200' : 'border-white/5',
        searchFieldText: light ? 'text-slate-900' : 'text-white',
        searchPlaceholder: light ? 'text-slate-400' : 'text-gray-500',
        searchInputBorder: light ? 'border-slate-200' : 'border-white/10',
        selectOption: light ? 'bg-white text-slate-900' : 'bg-black text-white',
        listingCard: light
            ? 'border border-slate-200 bg-white hover:border-amber-400 hover:shadow-lg shadow-sm'
            : 'border border-white/10 bg-white/5 hover:border-amber-400 hover:bg-white/10',
        listingMeta: light ? 'text-slate-600' : 'text-gray-400',
        listingDesc: light ? 'text-slate-600' : 'text-gray-300',
        listingDivider: light ? 'border-slate-200' : 'border-white/10',
        metaChip: light
            ? 'bg-slate-100 text-slate-700'
            : 'bg-white/10 text-gray-300',
        emptyIcon: light ? 'text-slate-400' : 'text-gray-600',
        filterInput: light
            ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-amber-500'
            : 'bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:border-amber-400',
        filterPanel: light
            ? 'bg-white border border-slate-200 shadow-sm'
            : 'bg-white/5 backdrop-blur-sm border border-white/10',
        filterSelect: light
            ? 'bg-white border border-slate-300 text-slate-900'
            : 'bg-white/10 border border-white/20 text-white',
        badge: light
            ? 'bg-white/95 text-slate-900 border border-slate-200 shadow-sm'
            : 'bg-black/60 border border-white/10',
        infoBanner: light
            ? 'border-amber-200 bg-amber-50 text-amber-900'
            : 'border-amber-400/30 bg-amber-400/10 text-amber-100',
        apiWarning: light
            ? 'border-amber-300 bg-amber-50 text-amber-900'
            : 'border-amber-400/30 bg-amber-400/10 text-amber-100',
        nav: light
            ? 'border-b border-slate-200 bg-white/90 backdrop-blur-xl'
            : 'border-b border-white/5 bg-black/60 backdrop-blur-xl',
        navText: light ? 'text-slate-600 hover:text-amber-600' : 'text-gray-400 hover:text-amber-400',
        navBrand: light ? 'text-slate-900' : 'text-white',
        navLogin: light ? 'text-slate-700 hover:text-slate-900' : 'text-gray-300 hover:text-white',
        navMobile: light ? 'bg-white/95 border-slate-200' : 'bg-black/90 border-white/5',
        navMobileLink: light
            ? 'text-slate-700 hover:text-amber-600 hover:bg-slate-100'
            : 'text-gray-300 hover:text-amber-400 hover:bg-white/5',
        footer: light
            ? 'border-t border-slate-200 bg-white py-16'
            : 'border-t border-white/5 bg-[#030303] py-16',
        footerText: light ? 'text-slate-500 hover:text-slate-900' : 'text-gray-500 hover:text-white',
        footerMuted: light ? 'text-slate-400' : 'text-gray-600',
        linkAccent: light ? 'hover:text-amber-700' : 'hover:text-white',
        card: light
            ? 'bg-white border border-slate-200 shadow-sm hover:shadow-md transition'
            : 'bg-[#111] border border-white/10 hover:bg-white/5 transition'
    }
}
