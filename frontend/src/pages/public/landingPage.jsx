import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ShoppingBag,
  RotateCcw,
  IdCard,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useLibrary } from '../../context/libraryContext';
import { useAuth } from '../../context/authContext';
import { useToast } from '../../context/toastContext';

const HERO_SLIDES = [
  {
    src: '/images/perpus-ruang-baca.jpg',
    title: 'Ruang Baca Umum',
    caption: 'Fasilitas meja baca dan koleksi terbuka UPT Perpustakaan UNIPMA',
  },
  {
    src: '/images/perpus-rak-buku.jpg',
    title: 'Koleksi Rak Terbuka',
    caption: 'Ribuan literatur cetak dari berbagai bidang ilmu program studi',
  },
  {
    src: '/images/perpus-lorong.jpg',
    title: 'Area Sirkulasi & Referensi',
    caption: 'Loket pelayanan peminjaman, pengembalian, dan terbitan berkala',
  },
  {
    src: '/images/perpus-orientasi.jpeg',
    title: 'Literasi & Orientasi Pemustaka',
    caption: 'Kegiatan pengenalan layanan perpustakaan bagi mahasiswa baru',
  },
];

export default function LandingPage() {
  const { books, categories, settings } = useLibrary();
  const { isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('ALL');
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  // Hanya buku aktif yang sudah memiliki kode eksemplar (sesuai aturan backend)
  const publishedBooks = useMemo(
    () => books.filter((b) => b.is_active !== false && b.coded_count > 0),
    [books]
  );

  const latestBooks = useMemo(
    () =>
      [...publishedBooks]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 6),
    [publishedBooks]
  );

  const totalAvailableStock = publishedBooks.reduce(
    (sum, b) => sum + Number(b.available_stock || 0),
    0
  );

  const categoryCounts = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        count: publishedBooks.filter((b) => Number(b.category_id) === Number(cat.id)).length,
      }))
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [categories, publishedBooks]);

  const loanDays = settings?.defaultLoanDurationDays || 7;
  const maxLoans = settings?.maxActiveLoansPerUser || 3;

  // Auto-slide foto hero
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToCatalog = (targetUrl = '/books') => {
    if (!isAuthenticated) {
      showToast('Silakan masuk terlebih dahulu untuk membuka katalog buku.', 'info');
      navigate('/login', { state: { from: { pathname: targetUrl } } });
      return;
    }
    navigate(targetUrl);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (searchCategory !== 'ALL') params.set('category', searchCategory);
    const qs = params.toString();
    goToCatalog(qs ? `/books?${qs}` : '/books');
  };

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/dashboard';

  const services = [
    {
      icon: BookOpen,
      title: 'Katalog Online',
      desc: 'Telusuri koleksi berdasarkan judul, penulis, ISBN, atau kode buku.',
      action: () => goToCatalog('/books'),
    },
    {
      icon: ShoppingBag,
      title: 'Peminjaman Online',
      desc: `Kumpulkan buku di Book Cart, maksimal ${maxLoans} buku aktif per anggota.`,
      action: () => goToCatalog('/books'),
    },
    {
      icon: RotateCcw,
      title: 'Pengembalian Buku',
      desc: 'Ajukan pengembalian dari dashboard, lalu serahkan buku ke petugas.',
      action: () => (isAuthenticated ? navigate(dashboardPath) : navigate('/login')),
    },
    {
      icon: IdCard,
      title: 'Verifikasi NIM',
      desc: 'Daftarkan NIM Anda agar dapat diverifikasi petugas sebelum meminjam.',
      action: () => (isAuthenticated ? navigate('/profile') : navigate('/register')),
    },
  ];

  const steps = [
    {
      title: 'Buat akun anggota',
      desc: 'Daftar menggunakan nama, email kampus, dan NIM yang masih aktif.',
    },
    {
      title: 'Tunggu verifikasi NIM',
      desc: 'Petugas memeriksa NIM Anda. Status verifikasi dapat dilihat di halaman profil.',
    },
    {
      title: 'Pilih buku dan ajukan',
      desc: `Masukkan buku ke Book Cart lalu kirim pengajuan. Batas pinjam aktif ${maxLoans} buku.`,
    },
    {
      title: 'Ambil buku di loket sirkulasi',
      desc: `Setelah pengajuan disetujui, ambil buku di perpustakaan. Masa pinjam ${loanDays} hari.`,
    },
    {
      title: 'Kembalikan tepat waktu',
      desc: 'Ajukan pengembalian lewat dashboard dan serahkan buku kepada petugas untuk dikonfirmasi.',
    },
  ];

  const faqs = [
    {
      q: 'Kapan jam buka layanan Perpustakaan UNIPMA?',
      a: (
        <>
          Pencarian katalog dan pengajuan lewat UNIPUS dapat diakses daring 24 jam. Untuk layanan
          fisik pengambilan dan pengembalian buku di loket sirkulasi buka setiap{' '}
          <strong className="font-semibold text-slate-800">Senin – Sabtu pukul 07.30 – 16.00 WIB</strong>{' '}
          (Minggu tutup), serta dapat berubah saat hari libur atau agenda khusus seperti pada{' '}
          <a
            href="https://www.instagram.com/p/DUssoHRDyNN/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0088CC] underline hover:text-[#006FA6]"
          >
            pengumuman layanan libur perpustakaan
          </a>
          .
        </>
      ),
    },
    {
      q: 'Siapa saja yang dapat meminjam buku melalui UNIPUS?',
      a: 'Mahasiswa Universitas PGRI Madiun yang sudah memiliki akun dan NIM-nya telah diverifikasi oleh petugas perpustakaan.',
    },
    {
      q: 'Berapa lama masa peminjaman buku?',
      a: `Masa pinjam standar adalah ${loanDays} hari sejak buku disetujui. Tanggal batas pengembalian tercantum pada detail transaksi di dashboard Anda.`,
    },
    {
      q: 'Berapa banyak buku yang boleh dipinjam sekaligus?',
      a: `Setiap anggota dapat memiliki maksimal ${maxLoans} buku aktif, termasuk buku yang masih menunggu persetujuan.`,
    },
    {
      q: 'Apa yang terjadi jika saya terlambat mengembalikan buku?',
      a: 'Status pinjaman akan berubah menjadi terlambat. Selama masih ada buku yang terlambat, Anda belum bisa mengajukan peminjaman baru.',
    },
    {
      q: 'Mengapa ada buku yang tidak muncul di katalog?',
      a: 'Buku baru tampil di katalog setelah petugas memberi kode pada setiap eksemplarnya. Buku yang stoknya sedang habis tetap tampil, tetapi belum bisa diajukan.',
    },
  ];

  return (
    <div className="bg-white">
      {/* ================= HERO (FULL-BLEED PHOTO + DARK MATTE OVERLAY) ================= */}
      <section id="home" className="relative scroll-mt-28">
        <div className="relative min-h-[540px] w-full overflow-hidden bg-slate-950 pb-24 pt-14 sm:min-h-[580px] sm:pb-28 sm:pt-20">
          {/* Foto Background Full-Width */}
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.caption}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                idx === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* Lapisan Gelap Merata (Dark Matte Tint) + Aksen Diagonal Halus di Sisi Teks */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: 'rgba(10, 20, 35, 0.62)' }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(6, 16, 30, 0.62) 0%, rgba(6, 16, 30, 0.42) 50%, rgba(6, 16, 30, 0.12) 100%)',
            }}
          />

          {/* Konten Utama di Atas Background */}
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2.5 border-l-2 border-[#38BDF8] pl-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#89CFF3] drop-shadow-sm">
                UPT Perpustakaan Universitas PGRI Madiun
              </span>
            </div>

            <h1 className="mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight text-white drop-shadow-sm sm:text-5xl">
              Temukan referensi kuliahmu di Perpustakaan UNIPMA
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 drop-shadow-sm sm:text-base">
              Portal layanan sirkulasi daring <strong className="font-semibold text-white">UNIPUS</strong> untuk menelusuri koleksi buku, mengajukan peminjaman, dan memantau jadwal pengembalian.
            </p>

            {/* Panel Pencarian Katalog (OPAC) */}
            <form
              onSubmit={handleSearch}
              className="mt-7 flex w-full max-w-3xl flex-col overflow-hidden rounded-md bg-white shadow-2xl sm:mt-8 sm:flex-row"
            >
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="border-b border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-700 focus:outline-none sm:w-52 sm:border-b-0 sm:border-r"
                aria-label="Pilih kategori"
              >
                <option value="ALL">Semua kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Judul buku, nama penulis, ISBN, atau kode buku..."
                  className="w-full py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0088CC] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#006FA6]"
              >
                Cari Koleksi
              </button>
            </form>

            {/* Pintasan Kategori Populer */}
            {categoryCounts.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-300">Subjek populer:</span>
                {categoryCounts.slice(0, 4).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => goToCatalog(`/books?category=${cat.id}`)}
                    className="rounded-full border border-white/30 bg-black/25 px-3 py-1 text-slate-100 backdrop-blur-xs transition-colors hover:border-white hover:bg-white/15"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Kontrol Slide Foto */}
            <div className="mt-7 flex items-center gap-3.5">
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                }
                className="rounded-full border border-white/40 bg-black/25 p-1.5 text-white transition-colors hover:border-white hover:bg-white/20"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeSlide ? 'w-8 bg-white' : 'w-3 bg-white/45 hover:bg-white/70'
                    }`}
                    aria-label={`Foto ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="rounded-full border border-white/40 bg-black/25 p-1.5 text-white transition-colors hover:border-white hover:bg-white/20"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span
                aria-live="polite"
                className="hidden text-xs font-medium text-slate-200 sm:inline"
              >
                {HERO_SLIDES[activeSlide].title} — {HERO_SLIDES[activeSlide].caption}
              </span>
            </div>
          </div>
        </div>

        {/* Service tiles overlapping hero */}
        <div id="layanan" className="relative z-10 mx-auto -mt-14 max-w-7xl scroll-mt-28 px-4 sm:-mt-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-md sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.title}
                  type="button"
                  onClick={svc.action}
                  className="group flex items-start gap-4 border-b border-slate-200 p-6 text-left transition-colors last:border-b-0 hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                >
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-[#0088CC]" strokeWidth={1.75} />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{svc.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{svc.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0088CC] group-hover:underline">
                      Selengkapnya <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ANGKA KOLEKSI ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-y-6 border-y border-slate-200 py-8 lg:grid-cols-4">
          {[
            { label: 'Judul buku di katalog', value: publishedBooks.length },
            { label: 'Eksemplar siap dipinjam', value: totalAvailableStock },
            { label: 'Kategori bidang ilmu', value: categoryCounts.length || categories.length },
            { label: 'Hari masa peminjaman', value: loanDays },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col-reverse px-2 text-center lg:border-r lg:border-slate-200 lg:last:border-r-0"
            >
              <dt className="mt-1 text-xs text-slate-500">{item.label}</dt>
              <dd className="font-serif text-3xl font-bold text-[#0A2540]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ================= KOLEKSI TERBARU ================= */}
      <section id="katalog" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">Koleksi Terbaru</h2>
            <p className="mt-1 text-sm text-slate-500">
              Buku yang baru ditambahkan petugas ke katalog perpustakaan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => goToCatalog('/books')}
            className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#0088CC] hover:underline sm:self-auto"
          >
            Lihat semua {publishedBooks.length} judul <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {categoryCounts.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {categoryCounts.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => goToCatalog(`/books?category=${cat.id}`)}
                className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-[#0088CC] hover:text-[#0088CC]"
              >
                {cat.name} <span className="text-slate-400">({cat.count})</span>
              </button>
            ))}
          </div>
        )}

        {latestBooks.length === 0 ? (
          <p className="mt-10 rounded-md border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500">
            Belum ada buku yang tersedia di katalog.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {latestBooks.map((book) => {
              const available = Number(book.available_stock) > 0;
              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => goToCatalog(`/books/${book.id}`)}
                  className="group text-left"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-sm border border-slate-200 bg-slate-100 shadow-sm">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-slate-400">
                        Sampul belum tersedia
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    {book.category_name || 'Umum'}
                  </p>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-[#0088CC]">
                    {book.title}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {book.author || '-'}
                    {book.publication_year ? `, ${book.publication_year}` : ''}
                  </p>
                  <p
                    className={`mt-1.5 text-xs font-medium ${
                      available ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {available ? `Tersedia ${book.available_stock} eksemplar` : 'Sedang dipinjam semua'}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= PANDUAN PEMINJAMAN ================= */}
      <section id="panduan" className="scroll-mt-28 bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
              Panduan Peminjaman Buku
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Ikuti lima langkah berikut untuk meminjam buku Perpustakaan UNIPMA melalui UNIPUS.
            </p>

            <ol className="mt-8 space-y-6">
              {steps.map((step, idx) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#0088CC] text-sm font-bold text-[#0088CC]">
                    {idx + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            {!isAuthenticated && (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded-md bg-[#0088CC] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#006FA6]"
                >
                  Daftar sebagai anggota
                </Link>
                <Link
                  to="/login"
                  className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
                >
                  Sudah punya akun? Masuk
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-5 self-center">
            <figure>
              <img
                src="/images/perpus-orientasi.jpeg"
                alt="Pengenalan layanan perpustakaan kepada mahasiswa baru"
                className="w-full rounded-md object-cover shadow-sm"
              />
              <figcaption className="mt-2 text-xs text-slate-500">
                Pengenalan layanan Perpustakaan UNIPMA kepada mahasiswa baru.
              </figcaption>
            </figure>

            {/* Kotak Informasi Jam Operasional Loket Sirkulasi */}
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0A2540]">
                <Clock className="h-4 w-4 text-[#0088CC]" />
                Jam Buka Layanan Sirkulasi (Pengambilan & Pengembalian Buku)
              </div>
              <div className="mt-3 divide-y divide-slate-100 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Senin – Sabtu</span>
                  <span className="font-semibold text-slate-900">07.30 – 16.00 WIB</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Minggu & Libur Nasional</span>
                  <span className="font-medium text-rose-600">Tutup</span>
                </div>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
                Jam layanan dapat berubah saat hari libur akademik atau agenda khusus. Pantau info
                terbaru melalui{' '}
                <a
                  href="https://www.instagram.com/p/DUssoHRDyNN/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#0088CC] hover:underline"
                >
                  pengumuman layanan libur perpustakaan
                  <ExternalLink className="h-3 w-3" />
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROFIL: TENTANG + VISI MISI ================= */}
      <section id="tentang" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src="/images/perpus-lorong.jpg"
              alt="Area layanan Perpustakaan UNIPMA"
              className="h-full max-h-[420px] w-full rounded-md object-cover"
            />
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
              Tentang Perpustakaan UNIPMA
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              UPT Perpustakaan Universitas PGRI Madiun melayani mahasiswa, dosen, dan tenaga
              kependidikan dalam memenuhi kebutuhan referensi untuk pembelajaran dan penelitian.
              Melalui <strong className="text-slate-800">UNIPUS (UNIPMA Perpustakaan)</strong>,
              pencarian koleksi, pengajuan pinjaman, hingga konfirmasi pengembalian tercatat
              secara tertib dan dapat dipantau langsung oleh anggota maupun petugas.
            </p>

            <div id="visi-misi" className="scroll-mt-28">
              <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-[#0088CC]">Visi</h3>
              <blockquote className="mt-2 border-l-4 border-[#0088CC] pl-4 font-serif text-lg italic leading-relaxed text-slate-800">
                Menjadi pusat layanan informasi dan sumber belajar yang modern dan terintegrasi
                untuk mendukung Tri Dharma Perguruan Tinggi di Universitas PGRI Madiun.
              </blockquote>

              <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-[#0088CC]">Misi</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600 marker:font-semibold marker:text-slate-800">
                <li>Mengembangkan koleksi pustaka cetak dan digital yang relevan dengan kebutuhan akademik.</li>
                <li>Menyelenggarakan layanan sirkulasi yang cepat, mudah, dan transparan melalui UNIPUS.</li>
                <li>Meningkatkan budaya baca dan literasi informasi sivitas akademika.</li>
                <li>Mengelola katalog, stok, dan arsip transaksi perpustakaan secara akuntabel.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Kontribusi Eksplisit Terhadap SDGs Poin 4: Quality Education (Full-Width Desktop) */}
        <div className="mt-10 w-full rounded-r-md border border-slate-200 border-l-4 border-l-[#C5192D] bg-slate-50 px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#C5192D]">
            Kontribusi SDGs 4 — Pendidikan Berkualitas (Quality Education)
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            UNIPUS dikembangkan untuk memperluas akses merata terhadap sumber bacaan akademik kampus
            secara daring 24 jam, memangkas antrean administrasi manual melalui{' '}
            <strong className="font-semibold text-slate-800">Book Cart</strong> multi buku, serta
            menjaga akurasi ketersediaan literatur lewat sistem kode unik per eksemplar.
          </p>
        </div>
      </section>

      {/* ================= GALERI ================= */}
      <section className="bg-[#0A2540] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">Galeri Perpustakaan</h2>
            <p className="hidden text-sm text-slate-300 sm:block">Suasana ruang layanan UNIPMA</p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:h-[420px] lg:grid-cols-4 lg:grid-rows-2">
            {[
              {
                src: '/images/perpus-ruang-baca.jpg',
                label: 'Ruang baca umum',
                span: 'sm:col-span-2 lg:col-span-2 lg:row-span-2 h-60 sm:h-72 lg:h-full',
              },
              {
                src: '/images/perpus-rak-buku.jpg',
                label: 'Rak koleksi buku',
                span: 'h-52 lg:h-full',
              },
              {
                src: '/images/perpus-lorong.jpg',
                label: 'Area sirkulasi',
                span: 'h-52 lg:h-full',
              },
              {
                src: '/images/perpus-orientasi.jpeg',
                label: 'Pengenalan layanan bagi mahasiswa baru',
                span: 'sm:col-span-2 lg:col-span-2 h-52 sm:h-60 lg:h-full',
              },
            ].map((photo) => (
              <figure
                key={photo.src}
                className={`group relative overflow-hidden rounded-sm ${photo.span}`}
              >
                <img
                  src={photo.src}
                  alt={photo.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3.5 pb-3 pt-8 text-xs font-medium text-white">
                  {photo.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
          Pertanyaan yang Sering Diajukan
        </h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-slate-600">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
