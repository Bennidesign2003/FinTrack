import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UsersIcon,
  TagIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChartPieIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'

const NavItem = ({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active?: boolean }) => (
  <Link
    href={href}
    className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-white/80 ${
      active
        ? 'bg-white/20 text-white shadow-[0_15px_40px_rgba(15,23,42,0.35)]'
        : 'hover:bg-white/10 hover:text-white'
    }`}
  >
    <span
      className={`grid w-9 h-9 place-items-center rounded-2xl ${
        active ? 'bg-white/40 text-white' : 'bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
    </span>
    <span className="font-medium text-sm">{label}</span>
  </Link>
)

export default function Sidebar() {
  const pathname = usePathname()
  const navItems = [
    { href: '/', label: 'Dashboard', icon: HomeIcon },
    { href: '/customers', label: 'Kunden', icon: UsersIcon },
    { href: '/suppliers', label: 'Lieferanten', icon: TagIcon },
    { href: '/invoices', label: 'Rechnungen', icon: DocumentTextIcon },
    { href: '/payments', label: 'Zahlungen', icon: CreditCardIcon },
    { href: '/reports', label: 'Berichte', icon: ChartPieIcon },
    { href: '/chart-of-accounts', label: 'Kontenplan', icon: BookOpenIcon }
  ]

  return (
    <aside
      className="w-64 border-r border-white/30 sticky top-0 h-screen"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 25px 60px rgba(15,23,42,0.4)'
      }}
    >
      <div className="p-4 border-b">
        <div className="text-xl font-bold text-white">FinTrack</div>
      </div>
      <nav className="p-2 mt-2">
        <NavItem href="/" icon={HomeIcon} label="Dashboard" />
        <NavItem href="/customers" icon={UsersIcon} label="Kunden" />
        <NavItem href="/suppliers" icon={TagIcon} label="Lieferanten" />
        <NavItem href="/invoices" icon={DocumentTextIcon} label="Rechnungen" />
        <NavItem href="/payments" icon={CreditCardIcon} label="Zahlungen" />
        <NavItem href="/reports" icon={ChartPieIcon} label="Berichte" />
        <NavItem href="/chart-of-accounts" icon={BookOpenIcon} label="Kontenplan" />
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/40">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">MM</div>
          <div>
            <div className="text-sm font-medium text-white">Max Mustermann</div>
            <div className="text-xs text-white/70">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
