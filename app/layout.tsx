import './globals.css';
import Link from 'next/link';
import {CalendarRange} from 'lucide-react';
export const metadata={title:'OnCampus — PES University Events',description:'A student-built place for verified PES University competitions, workshops and campus events.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><header className="header"><div className="container header-content"><Link href="/" className="brand"><span className="brand-icon"><CalendarRange size={22}/></span>oncampus<span className="brand-dot">.</span></Link><nav className="nav"><Link href="/">Explore</Link><Link href="/admin">Admin</Link></nav></div></header>{children}<footer><div className="container">OnCampus · Built by students, for students · Independent project, not affiliated with PES University.</div></footer></body></html>}
