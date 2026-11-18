import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Captions, Check, Clock, Cpu, FileText, Film, Menu, MonitorSmartphone,
  Play, ScanFace, ShieldCheck, Sparkles, Stamp, Upload, WandSparkles, WifiOff, X, Plus, Scissors, HardDrive,
} from "lucide-react";

const HUB_URL = "https://promaker-id.vercel.app";
const CV_URL = "https://cvpromaker.vercel.app";
const YEAR = new Date().getFullYear();

/* ---------- kecil-kecil ---------- */
function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Clip Pro Maker">
      <span className="logo-mark">
        <svg viewBox="0 0 64 64" width="18" height="18" aria-hidden="true"><rect x="19" y="8" width="26" height="48" rx="7" fill="#0b0d14" /><path d="M28 24l12 8-12 8z" fill="#C6F432" /></svg>
      </span>
      <span className="logo-text">Clip Pro <b>Maker</b></span>
    </a>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    if (typeof IntersectionObserver === "undefined") { els.forEach((e) => e.classList.add("in")); return undefined; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ---------- ilustrasi pembicara (SVG) ---------- */
function Person() {
  return (
    <svg className="person" viewBox="0 0 100 124" aria-hidden="true">
      <defs>
        <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b2a8f" /><stop offset="1" stopColor="#241a63" /></linearGradient>
      </defs>
      <ellipse cx="50" cy="132" rx="46" ry="40" fill="url(#shirt)" />
      <rect x="42" y="76" width="16" height="20" rx="6" fill="#e0a982" />
      <ellipse cx="50" cy="52" rx="24" ry="29" fill="#2b1d14" />
      <ellipse cx="50" cy="58" rx="20" ry="24" fill="#f0bf98" />
      <path d="M28 50a23 18 0 0 1 44 0c-6-9-14-12-22-12s-16 3-22 12z" fill="#2b1d14" />
      <path d="M25 54a25 25 0 0 1 50 0" fill="none" stroke="#0e1018" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="20" y="50" width="8" height="14" rx="4" fill="#0e1018" />
      <rect x="72" y="50" width="8" height="14" rx="4" fill="#0e1018" />
      <path d="M24 62c0 12 8 20 20 21" fill="none" stroke="#0e1018" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="46" cy="83" r="3" fill="#0e1018" />
      <circle cx="42" cy="57" r="2" fill="#2a1a12" /><circle cx="58" cy="57" r="2" fill="#2a1a12" />
      <path d="M38 52q4-3 8 0M54 52q4-3 8 0" stroke="#2b1d14" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse className="mouth" cx="50" cy="69" rx="5" ry="2.6" fill="#a24a3b" />
    </svg>
  );
}

function Scene({ moving }) {
  return (
    <div className={`scene${moving ? " moving" : ""}`}>
      <i className="orb o1" /><i className="orb o2" />
      <div className="shelf" />
      <div className="desk" />
      <div className="who"><Person /></div>
    </div>
  );
}

/* ---------- ponsel pratinjau klip ---------- */
const CAPTION = ["Ini", "momen", "yang", "bikin", "penonton", "berhenti", "scroll", "dan", "ikut", "menonton"];
const FONTS = { tegas: "Anton, Impact, sans-serif", modern: "Inter, system-ui, sans-serif", santai: "'Bricolage Grotesque', Inter, sans-serif" };
const SIZES = { s: 6, m: 8, l: 10.5 };
const POS = { atas: "14%", tengah: "46%", bawah: "15%" };

function useWordTicker(ms = 420) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % CAPTION.length), ms);
    return () => clearInterval(t);
  }, [ms]);
  return i;
}

function Phone({ mode = "pita", accent = "#C6F432", size = "m", pos = "bawah", font = "modern", score = 94, compact }) {
  const i = useWordTicker();
  const start = Math.floor(i / 3) * 3;
  const words = CAPTION.slice(start, start + 3);
  const capStyle = pos === "bawah" ? { bottom: mode === "pita" ? "21%" : POS.bawah } : pos === "atas" ? { top: POS.atas } : { top: POS.tengah };
  return (
    <div className={`phone${compact ? " compact" : ""}`}>
      <div className="phone-notch" />
      <div className="screen" style={{ "--accent": accent }}>
        {(mode === "pita" || mode === "blur") && <div className="bgblur"><Scene /></div>}
        <div className={`win win-${mode}`} key={mode}><Scene /></div>
        {mode === "pita" && (<>
          <span className="band-title">PODCAST EP. 12</span>
          <span className="band-logo"><Scissors size={11} /> logo kamu</span>
        </>)}
        <span className="score"><Sparkles size={11} /> Skor {score}</span>
        <div className="cap" style={{ ...capStyle, fontFamily: FONTS[font], fontSize: `${SIZES[size]}cqw` }}>
          {words.map((w, k) => <span key={`${start}-${k}`} className={start + k === i ? "act" : ""}>{w}</span>)}
        </div>
        <div className="rec"><i style={{ width: `${((i + 1) / CAPTION.length) * 100}%` }} /></div>
      </div>
    </div>
  );
}

/* ---------- nav ---------- */
function Nav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const c = () => setOpen(false);
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Logo />
        <nav className={`nav-links${open ? " open" : ""}`} aria-label="Navigasi utama">
          <a href="#cara-kerja" onClick={c}>Cara kerja</a>
          <a href="#studio" onClick={c}>Studio</a>
          <a href="#fitur" onClick={c}>Fitur</a>
          <a href="#privasi" onClick={c}>Privasi</a>
          <a href="#faq" onClick={c}>FAQ</a>
          <a className="back-link" href={HUB_URL} onClick={c}><ArrowLeft size={14} /> ProMaker</a>
        </nav>
        <span className="soon-pill"><i /> Segera hadir</span>
        <button className="nav-toggle" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

/* ---------- hero ---------- */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="grid-bg" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><i className="dot" /> Segera hadir · Aplikasi desktop Windows</span>
          <h1>Satu video panjang, <span className="hl">belasan klip</span> vertikal.</h1>
          <p className="lead">Clip Pro Maker memotong video panjangmu jadi klip 9:16 dengan bingkai yang mengikuti wajah pembicara dan subtitle otomatis. Semuanya berjalan di komputermu sendiri.</p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#cara-kerja">Lihat cara kerja <ArrowRight size={17} /></a>
            <a className="btn btn-ghost" href="#studio"><Play size={14} /> Coba studio interaktif</a>
          </div>
          <ul className="ticks">
            <li><Check size={15} /> Tanpa kredit</li>
            <li><Check size={15} /> Video tidak diunggah</li>
            <li><Check size={15} /> Subtitle otomatis</li>
          </ul>
        </div>
        <HeroDemo />
      </div>
    </section>
  );
}

function HeroDemo() {
  return (
    <div className="demo" aria-label="Contoh cara kerja Clip Pro Maker">
      <div className="src">
        <div className="src-bar"><i /><i /><i /><span>podcast-ep-12.mp4</span><em>16:9 · 48:12</em></div>
        <div className="src-view">
          <Scene moving />
          <div className="crop"><span>9:16</span></div>
        </div>
        <div className="tl" aria-hidden="true">
          <div className="tl-track">
            {[[6, 9, 94], [24, 8, 88], [47, 10, 91], [71, 8, 85]].map(([l, w, s]) => (
              <b key={l} style={{ left: `${l}%`, width: `${w}%` }}><u>{s}</u></b>
            ))}
            <i className="playhead" />
          </div>
          <div className="tl-lab"><span>00:00</span><span>Momen terbaik ditandai otomatis</span><span>48:12</span></div>
        </div>
      </div>
      <div className="demo-arrow" aria-hidden="true"><ArrowRight size={22} /></div>
      <div className="demo-phone"><Phone mode="pita" /></div>
      <span className="float f1"><ScanFace size={14} /> Bingkai ikut wajah</span>
      <span className="float f2"><Captions size={14} /> Subtitle otomatis</span>
      <span className="float f3"><ShieldCheck size={14} /> Diproses di komputermu</span>
    </div>
  );
}

function Strip() {
  const items = ["Podcast", "Wawancara", "Kelas online", "Webinar", "Review produk", "Ceramah", "Live replay", "Presentasi"];
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-in">
        {[...items, ...items].map((t, k) => <span key={k}><Film size={14} /> {t}</span>)}
      </div>
    </div>
  );
}

/* ---------- cara kerja ---------- */
const MOMENTS = [
  ["04:12", "Kesalahan terbesar saat memulai usaha", 94],
  ["17:40", "Satu kebiasaan yang mengubah segalanya", 91],
  ["29:05", "Jawaban jujur soal gagal berkali-kali", 88],
  ["41:22", "Tips terakhir yang jarang dibahas", 85],
];

function HowItWorks() {
  return (
    <section className="section" id="cara-kerja">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow soft">Cara kerja</span>
          <h2>Dari rekaman panjang ke klip siap unggah, dalam tiga langkah</h2>
          <p>Tampilan di bawah hanya contoh untuk menggambarkan alurnya.</p>
        </div>
        <div className="steps">
          <article className="step rv">
            <span className="step-n">1</span>
            <div className="mock mock-drop">
              <Upload size={22} />
              <b>Pilih videomu</b>
              <small>podcast-ep-12.mp4 · 48:12 · 1080p</small>
            </div>
            <h3>Pilih videomu</h3>
            <p>Klik kotak besar lalu pilih file video dari komputer. Paling cocok untuk video yang banyak bicara.</p>
          </article>
          <article className="step rv">
            <span className="step-n">2</span>
            <div className="mock mock-list">
              {MOMENTS.map(([t, n, s]) => (
                <div className="mrow" key={t}><span className="mt">{t}</span><span className="mn">{n}</span><span className="ms"><i style={{ width: `${s}%` }} /><em>{s}</em></span></div>
              ))}
            </div>
            <h3>Momen terbaik ditandai</h3>
            <p>Aplikasi mentranskrip audio lalu menilai bagian mana yang paling layak jadi klip. Kamu tinggal memilih.</p>
          </article>
          <article className="step rv">
            <span className="step-n">3</span>
            <div className="mock mock-set">
              <div className="srow"><span>Jumlah klip</span><b>8</b></div>
              <div className="srow"><span>Durasi</span><b>30–60 dtk</b></div>
              <div className="srow"><span>Bingkai</span><b>Ikuti wajah + pita</b></div>
              <div className="sbtn"><WandSparkles size={14} /> Buat Klip</div>
            </div>
            <h3>Atur lalu buat klip</h3>
            <p>Tentukan jumlah, durasi, dan bingkai. Klik Buat Klip, lalu unduh hasilnya satu per satu.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- studio interaktif ---------- */
const MODES = [
  ["wajah", "Ikuti wajah", "Layar penuh, bingkai ikut pembicara."],
  ["pita", "Ikuti wajah + pita", "Ada pita blur atas dan bawah untuk judul dan logo. Paling disarankan."],
  ["blur", "Penuh + latar blur", "Seluruh gambar tetap terlihat, sisi atas dan bawah diisi latar blur."],
  ["tengah", "Potong tengah", "Paling ringan, memotong dari tengah gambar tanpa mengikuti wajah."],
];
const COLORS = [["#C6F432", "Lime"], ["#FF4D8D", "Pink"], ["#38D9F5", "Biru"], ["#FFB020", "Kuning"], ["#FFFFFF", "Putih"]];

function Seg({ value, onChange, options }) {
  return (
    <div className="seg" role="group">
      {options.map(([v, l]) => <button key={v} className={value === v ? "on" : ""} aria-pressed={value === v} onClick={() => onChange(v)}>{l}</button>)}
    </div>
  );
}

function Studio() {
  const [mode, setMode] = useState("pita");
  const [accent, setAccent] = useState("#C6F432");
  const [size, setSize] = useState("m");
  const [pos, setPos] = useState("bawah");
  const [font, setFont] = useState("modern");
  const cur = MODES.find((m) => m[0] === mode);
  return (
    <section className="section studio" id="studio">
      <div className="wrap studio-grid">
        <div className="studio-ctrl rv">
          <span className="eyebrow soft">Studio interaktif</span>
          <h2>Atur tampilannya, lihat hasilnya langsung</h2>
          <p className="sub">Coba pilihan bingkai dan gaya subtitle yang akan tersedia di aplikasi.</p>

          <div className="ctl">
            <label>Bingkai klip</label>
            <div className="modes">
              {MODES.map(([v, l]) => (
                <button key={v} className={mode === v ? "on" : ""} aria-pressed={mode === v} onClick={() => setMode(v)}>{l}</button>
              ))}
            </div>
            <p className="hint">{cur[2]}</p>
          </div>
          <div className="ctl">
            <label>Warna kata yang disorot</label>
            <div className="swatches">
              {COLORS.map(([c, n]) => <button key={c} aria-label={n} aria-pressed={accent === c} className={accent === c ? "on" : ""} style={{ background: c }} onClick={() => setAccent(c)} />)}
            </div>
          </div>
          <div className="ctl two">
            <div><label>Gaya huruf</label><Seg value={font} onChange={setFont} options={[["tegas", "Tegas"], ["modern", "Modern"], ["santai", "Santai"]]} /></div>
            <div><label>Ukuran</label><Seg value={size} onChange={setSize} options={[["s", "Kecil"], ["m", "Sedang"], ["l", "Besar"]]} /></div>
          </div>
          <div className="ctl">
            <label>Posisi subtitle</label>
            <Seg value={pos} onChange={setPos} options={[["atas", "Atas"], ["tengah", "Tengah"], ["bawah", "Bawah"]]} />
          </div>
        </div>
        <div className="studio-view rv">
          <div className="halo" />
          <Phone mode={mode} accent={accent} size={size} pos={pos} font={font} />
        </div>
      </div>
    </section>
  );
}

/* ---------- fitur ---------- */
const FEATURES = [
  [ScanFace, "Bingkai mengikuti wajah", "Framing otomatis mengikuti pembicara, jadi wajahnya tetap di tengah meski ia bergerak."],
  [Captions, "Subtitle otomatis", "Suara diubah jadi teks lalu ditempel ke klip. Ukuran, warna sorotan, dan posisinya bisa kamu atur."],
  [Sparkles, "Momen terbaik berskor", "Setiap kandidat klip diberi skor supaya kamu tidak perlu menonton ulang seluruh video."],
  [Stamp, "Logo dan watermark", "Unggah logo channelmu sekali. Tempelkan ke klip, atur posisi dan ukurannya."],
  [FileText, "Deskripsi siap salin", "Tiap klip dapat deskripsi untuk YouTube dari kalimat yang benar-benar diucapkan di klip itu."],
  [ShieldCheck, "Jalan di komputermu", "Video diproses di komputermu sendiri. Tidak ada antrean server dan tidak ada yang diunggah."],
];

function Features() {
  return (
    <section className="section alt" id="fitur">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow soft">Fitur</span>
          <h2>Yang kamu butuhkan untuk bikin klip, tanpa ribet</h2>
        </div>
        <div className="feat-grid">
          {FEATURES.map(([Ic, t, d], k) => (
            <article className="feat rv" key={t} style={{ transitionDelay: `${(k % 3) * 70}ms` }}>
              <span className="feat-ic"><Ic size={20} /></span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- privasi + syarat ---------- */
function Privacy() {
  return (
    <section className="section" id="privasi">
      <div className="wrap priv">
        <div className="priv-copy rv">
          <span className="eyebrow soft">Privasi</span>
          <h2>Videomu tetap di komputermu</h2>
          <p>Seluruh proses, dari transkrip sampai render klip, berjalan di komputermu. Video tidak diunggah ke mana pun, dan setelah pemasangan selesai aplikasi bisa bekerja tanpa internet.</p>
          <ul className="req">
            <li><MonitorSmartphone size={18} /><div><b>Windows 10 atau 11</b><span>Aplikasi desktop untuk komputer Windows.</span></div></li>
            <li><HardDrive size={18} /><div><b>Sekitar 2 GB ruang kosong</b><span>Untuk komponen aplikasi dan hasil klip.</span></div></li>
            <li><WifiOff size={18} /><div><b>Internet hanya saat pemasangan</b><span>Setelah itu bekerja offline. Panduan pemasangan disertakan.</span></div></li>
          </ul>
        </div>
        <div className="priv-vis rv" aria-hidden="true">
          <div className="pc">
            <div className="pc-bar"><i /><i /><i /><span>Komputermu</span></div>
            <div className="pc-flow">
              <div className="node"><Film size={18} /><span>Video</span></div>
              <ArrowRight size={16} />
              <div className="node"><Captions size={18} /><span>Transkrip</span></div>
              <ArrowRight size={16} />
              <div className="node on"><Scissors size={18} /><span>Klip 9:16</span></div>
            </div>
            <div className="pc-note"><Cpu size={14} /> Diproses lokal</div>
          </div>
          <div className="cloud"><WifiOff size={16} /> Tidak ada unggahan ke server</div>
        </div>
      </div>
    </section>
  );
}

function Fit() {
  const good = ["Video satu pembicara yang banyak bicara", "Podcast, wawancara, kelas, dan review", "Audio jernih, bukan rekaman berisik", "Video berdurasi minimal beberapa menit"];
  const bad = ["Video musik", "Gameplay tanpa narasi", "Video yang isinya sedikit bicara"];
  return (
    <section className="section alt">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow soft">Jujur sejak awal</span>
          <h2>Cocok untuk apa, dan kurang cocok untuk apa</h2>
        </div>
        <div className="fit">
          <div className="fit-c good rv">
            <h3><Check size={18} /> Hasil terbaik</h3>
            <ul>{good.map((g) => <li key={g}><Check size={15} />{g}</li>)}</ul>
          </div>
          <div className="fit-c bad rv">
            <h3><X size={18} /> Kurang cocok</h3>
            <ul>{bad.map((g) => <li key={g}><X size={15} />{g}</li>)}</ul>
          </div>
        </div>
        <p className="fine rv">Subtitle otomatis bisa keliru pada nama orang dan istilah asing, jadi periksa dulu sebelum diunggah. Pemilihan momen membantu mempersempit pilihan, bukan menjamin klip jadi viral. Gunakan hanya untuk video milikmu atau yang kamu punya izin untuk mengeditnya.</p>
      </div>
    </section>
  );
}

/* ---------- status rilis ---------- */
function Release() {
  return (
    <section className="section" id="rilis">
      <div className="wrap">
        <div className="release rv">
          <div className="rel-copy">
            <span className="eyebrow"><i className="dot" /> Status</span>
            <h2>Clip Pro Maker sedang disiapkan</h2>
            <p>Halaman ini adalah tampilan awalnya. Informasi rilis, harga, dan cara mendapatkannya akan diumumkan di sini begitu siap.</p>
            <div className="cta-row">
              <a className="btn btn-primary" href={HUB_URL}><ArrowLeft size={16} /> Kembali ke ProMaker</a>
              <a className="btn btn-ghost" href={CV_URL}>Coba CV Pro Maker <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <ol className="road">
            <li className="done"><span><Check size={14} /></span><div><b>Aplikasi desktop</b><small>Sudah berjalan dan terus diuji</small></div></li>
            <li className="done"><span><Check size={14} /></span><div><b>Halaman Clip Pro Maker</b><small>Tampilan awal ini</small></div></li>
            <li className="now"><span><Clock size={14} /></span><div><b>Persiapan rilis</b><small>Sedang dikerjakan</small></div></li>
            <li><span /><div><b>Dibuka di ProMaker</b><small>Segera diumumkan</small></div></li>
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQ = [
  ["Apa itu Clip Pro Maker?", "Aplikasi desktop yang memotong video panjang menjadi klip vertikal 9:16. Bingkainya mengikuti wajah pembicara dan subtitle dibuat otomatis dari transkrip."],
  ["Apakah videoku diunggah ke internet?", "Tidak. Transkrip dan render klip berjalan di komputermu sendiri, jadi videomu tidak dikirim ke server mana pun."],
  ["Apakah butuh internet?", "Hanya saat pemasangan. Setelah selesai terpasang, aplikasi bisa dipakai tanpa internet."],
  ["Bisa dipakai di Mac atau HP?", "Saat ini yang disiapkan adalah versi Windows 10 dan 11. Versi lain belum dijadwalkan."],
  ["Seberapa akurat subtitlenya?", "Cukup baik untuk audio yang jernih, tapi nama orang dan istilah asing bisa keliru. Periksa dulu sebelum diunggah."],
  ["Berapa lama prosesnya?", "Tergantung panjang video dan kecepatan komputer. Sebagai gambaran kasar, video 30 menit butuh sekitar 10 sampai 20 menit. Tahap terlama adalah mentranskrip audio."],
  ["Video seperti apa yang paling cocok?", "Video satu pembicara yang banyak bicara, misalnya podcast, wawancara, kelas, atau review, dengan audio yang jernih."],
  ["Kapan dirilis dan berapa harganya?", "Belum diumumkan. Informasinya akan ditampilkan di halaman ini dan di ProMaker begitu siap."],
  ["Boleh dipakai untuk video orang lain?", "Gunakan hanya untuk videomu sendiri atau video yang kamu punya izin untuk mengeditnya."],
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section alt" id="faq">
      <div className="wrap narrow">
        <div className="sec-head center rv">
          <span className="eyebrow soft">FAQ</span>
          <h2>Pertanyaan yang sering muncul</h2>
        </div>
        <div className="faq rv">
          {FAQ.map(([q, a], i) => (
            <div className={`faq-i${open === i ? " on" : ""}`} key={q}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<Plus size={18} className="pl" /></button>
              <div className="faq-a"><div><p>{a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-in">
        <Logo />
        <div className="foot-links">
          <a href="#cara-kerja">Cara kerja</a>
          <a href="#fitur">Fitur</a>
          <a href="#faq">FAQ</a>
          <a href={HUB_URL}>ProMaker</a>
          <a href={CV_URL}>CV Pro Maker</a>
        </div>
        <small>© {YEAR} Clip Pro Maker, bagian dari ProMaker.</small>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <HowItWorks />
        <Studio />
        <Features />
        <Privacy />
        <Fit />
        <Release />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
