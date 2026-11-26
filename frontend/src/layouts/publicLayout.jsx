import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  LayoutDashboard,
  Bell,
  LogOut,
  Menu,
  X,
  MapPin,
  Globe,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { useLibrary } from '../context/libraryContext';
import BookCartDrawer from '../components/loans/bookCartDrawer';

const NAV_SECTIONS = [
  { id: 'home', label: 'Beranda' },
  { id: 'layanan', label: 'Layanan' },
  { id: 'katalog', label: 'Koleksi' },
  { id: 'panduan', label: 'Panduan' },
  { id: 'tentang', label: 'Profil' },
  { id: 'faq', label: 'FAQ' },
];

export default function PublicLayout() {
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { notifications } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [largeText, setLargeText] = useState(
    () => localStorage.getItem('unipus_font_scale') === 'lg'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('font-scale-lg', largeText);
    localStorage.setItem('unipus_font_scale', largeText ? 'lg' : 'normal');
  }, [largeText]);

  const unreadCount = notifications.filter(
    (n) => n.user_id === currentUser?.id && !n.is_read
  ).length;

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/dashboard';

  // Scroll ke section saat membuka /#section
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    }
  }, [location.pathname, location.hash]);

  const handleSectionNav = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Tautan Aksesibilitas Keyboard (Skip to Main Content) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-[#0A2540] focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#89CFF3]"
      >
        Lewati ke konten utama
      </a>

      <header className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Bar informasi atas */}
        <div className="hidden bg-[#0A2540] text-[11px] text-slate-300 md:block">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#89CFF3]" />
                Jl. Setiabudi No. 85, Kota Madiun
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#89CFF3]" />
                Buka Senin – Sabtu, 07.30 – 16.00 WIB
              </span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="https://www.instagram.com/perpustakaan_unipma?utm_source=ig_web_button_share_sheet&jplx=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#89CFF3] hover:text-white hover:underline"
              >
                Info Jadwal & Libur Layanan
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://unipma.ac.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <Globe className="h-3.5 w-3.5" />
                unipma.ac.id
              </a>
              <div
                className="flex items-center gap-1 border-l border-white/15 pl-4"
                role="group"
                aria-label="Pengaturan ukuran teks aksesibilitas"
              >
                <span className="mr-1 text-slate-400">Teks:</span>
                <button
                  type="button"
                  onClick={() => setLargeText(false)}
                  aria-pressed={!largeText}
                  title="Ukuran teks standar"
                  className={`rounded px-1.5 py-0.5 text-[11px] font-bold transition-colors ${
                    !largeText ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setLargeText(true)}
                  aria-pressed={largeText}
                  title="Perbesar ukuran teks untuk keterbacaan"
                  className={`rounded px-1.5 py-0.5 text-xs font-bold transition-colors ${
                    largeText ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigasi utama */}
        <div className="border-b border-slate-200">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" onClick={() => handleSectionNav('home')} className="flex items-center gap-3">
              <img src="/logo-unipma.png" alt="Logo UNIPMA" className="h-10 w-10 object-contain" />
              <div className="leading-tight">
                <p className="text-base font-extrabold tracking-wide text-[#0A2540]">UNIPUS</p>
                <p className="text-[11px] text-slate-500">Perpustakaan Universitas PGRI Madiun</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_SECTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionNav(item.id)}
                  className="rounded px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#0088CC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0088CC]/40"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {isAuthenticated && !isAdmin && (
                <button
                  type="button"
                  onClick={openCart}
                  className="relative inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#0088CC] hover:text-[#0088CC]"
                  title="Buka Book Cart"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">Book Cart</span>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0088CC] px-1.5 text-[11px] font-bold text-white">
                    {cartCount}
                  </span>
                </button>
              )}

              {isAuthenticated ? (
                <div className="hidden items-center gap-2 sm:flex">
                  {!isAdmin && (
                    <Link
                      to="/notifications"
                      className="relative rounded-md border border-slate-300 p-2 text-slate-600 hover:border-[#0088CC] hover:text-[#0088CC]"
                      title="Notifikasi"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center gap-2 rounded-md bg-[#0088CC] px-3 py-2 text-xs font-semibold text-white hover:bg-[#006FA6]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="max-w-[120px] truncate">
                      {isAdmin ? 'Dashboard Admin' : currentUser?.name}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-md border border-slate-300 p-2 text-slate-500 hover:border-rose-300 hover:text-rose-600"
                    title="Keluar"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    to="/login"
                    className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0088CC]"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-[#0088CC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#006FA6]"
                  >
                    Daftar Anggota
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
                aria-label="Buka menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex flex-col">
              {NAV_SECTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionNav(item.id)}
                  className="border-b border-slate-100 px-1 py-3 text-left text-sm font-medium text-slate-700"
                >
                  {item.label}
                </button>
              ))}

              <div className="flex items-center justify-between border-b border-slate-100 px-1 py-2.5 text-xs text-slate-600">
                <span>Ukuran Teks (Aksesibilitas)</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLargeText(false)}
                    aria-pressed={!largeText}
                    className={`rounded border px-2.5 py-1 font-bold ${
                      !largeText
                        ? 'border-[#0088CC] bg-[#0088CC] text-white'
                        : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setLargeText(true)}
                    aria-pressed={largeText}
                    className={`rounded border px-2.5 py-1 font-bold ${
                      largeText
                        ? 'border-[#0088CC] bg-[#0088CC] text-white'
                        : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    A+
                  </button>
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/books"
                    onClick={() => setMobileMenuOpen(false)}
                    className="border-b border-slate-100 px-1 py-3 text-sm font-medium text-slate-700"
                  >
                    Katalog Lengkap
                  </Link>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="border-b border-slate-100 px-1 py-3 text-sm font-semibold text-[#0088CC]"
                  >
                    {isAdmin ? 'Dashboard Admin' : 'Dashboard Saya'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-1 py-3 text-left text-sm font-semibold text-rose-600"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-md border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-700"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-md bg-[#0088CC] py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#071A2E] text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <img src="/logo-unipma.png" alt="Logo UNIPMA" className="h-11 w-11 object-contain" />
                <div className="leading-tight">
                  <p className="font-bold text-white">UNIPUS</p>
                  <p className="text-xs text-slate-400">UPT Perpustakaan Universitas PGRI Madiun</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Layanan perpustakaan daring untuk pencarian koleksi, peminjaman, dan pengembalian
                buku bagi sivitas akademika UNIPMA.
              </p>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Tautan</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {NAV_SECTIONS.slice(1).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSectionNav(item.id)}
                      className="hover:text-white"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Lokasi & Jam Layanan
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#89CFF3]" />
                  <span className="leading-relaxed">
                    Jl. Setiabudi No. 85, Kanigoro, Kec. Kartoharjo, Kota Madiun, Jawa Timur 63118
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#89CFF3]" />
                  <div className="leading-relaxed">
                    <p className="font-medium text-white">Senin – Sabtu: 07.30 – 16.00 WIB</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Dapat berubah saat hari libur atau agenda khusus (
                      <a
                        href="https://www.instagram.com/p/DUssoHRDyNN/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#89CFF3] underline hover:text-white"
                      >
                        lihat pengumuman layanan
                      </a>
                      ).
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#89CFF3]" />
                  <a href="https://unipma.ac.id" target="_blank" rel="noreferrer" className="hover:text-white">
                    unipma.ac.id
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} UNIPUS — UPT Perpustakaan Universitas PGRI Madiun.</p>
            <p className="text-slate-400">
              Mendukung Tujuan Pembangunan Berkelanjutan (SDGs 4: Pendidikan Berkualitas)
            </p>
          </div>
        </div>
      </footer>

      <BookCartDrawer />
    </div>
  );
}
