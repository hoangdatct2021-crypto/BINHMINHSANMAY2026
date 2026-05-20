import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Menu, 
  X, 
  Star, 
  Coffee, 
  Flame, 
  Wifi, 
  Car, 
  CloudSun, 
  Moon, 
  ChevronLeft,
  CheckCircle2,
  Info,
  Camera,
  User,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth, googleSignIn, appendBookingToSheet, logout } from './lib/googleSheets';
import { User as FirebaseUser } from 'firebase/auth';

// --- CONFIGURATION & IMAGE ASSETS ---
const BRAND_INFO = {
  name: "Bình Minh Săn Mây Bảo Lộc",
  logo: "https://lh3.googleusercontent.com/d/1kKXEZ_Gd-dFiQ398OHH1e4v04OR903Hx",
  address: "Hoài Thanh nối dài, Bảo Lâm 3, Bảo Lộc, Lâm Đồng",
  phone: "0825 095 678",
  zalo: "0825 095 678",
  maps: "https://maps.app.goo.gl/mBcM8TcAYNecZkyN6", // Replace with real link
  fanpage: "https://facebook.com/binhminhsanmaybaoloc", // Replace with real link
};

// Image placeholder function - User will replace these manually
const img = (name: string) => `https://placehold.co/1200x800/1B3022/white?text=${name}`;

const IMAGES = {
  covers: [
    "https://lh3.googleusercontent.com/d/181CexxuRzjodt6da8PXI8qzphcCIGWEi",
    "https://lh3.googleusercontent.com/d/1lD_wOfMfGKb-4rDF9DvipF2wfRiGoCN0",
    "https://lh3.googleusercontent.com/d/1whP-6knv6j5iiQsJbIWKcJq606UuKDb-",
    "https://lh3.googleusercontent.com/d/1rncFWgOZdhIty_viPq3rXgAl_Cn_4cuw",
    "https://lh3.googleusercontent.com/d/1-ncvALBUEOZfivSU_cTes4_fcJDmd2I1",
  ],
  rooms: {
    nha_go: [
      "https://lh3.googleusercontent.com/d/1j9G__puFVoyfcINonX93foSPMUoUaIhN",
      "https://lh3.googleusercontent.com/d/1D1gK9R65jXXAs5PY0dEL5YymdKqzqOVc",
      "https://lh3.googleusercontent.com/d/1Ihv0blGxcytGFAo4IdoGzWc54jWWYT8a"
    ],
    phong_rieng: [
      "https://lh3.googleusercontent.com/d/1sMO_h6fTDDwR407JXz98J8w7g6_OnLOO",
      "https://lh3.googleusercontent.com/d/14UyNfD97A1_jrDPVlPtIhGHhLV8EU6Im",
      "https://lh3.googleusercontent.com/d/1D27gHcVhzLUpN0YbBOB5Ktd6XW1pV7vB"
    ],
    bungalow_kieu_1: [
      "https://lh3.googleusercontent.com/d/1f261OBj-KPAXjIvmhTdXqVJTEtRi4AoR",
      "https://lh3.googleusercontent.com/d/1PpKhy9pDYy6fimjyE1VfaBXzCURQ2mLi",
      "https://lh3.googleusercontent.com/d/1jyRy6uDniB2XIvigwtRfG2F5y81kJxJy"
    ],
    bungalow_kieu_2: [
      "https://lh3.googleusercontent.com/d/1isk1yckzLu025teVTjdmVdQBQESnO5iB",
      "https://lh3.googleusercontent.com/d/1QxAXn8zIg4qa0lS5rEzrBWqwKs4-fXrX",
      "https://lh3.googleusercontent.com/d/1DlW7Ui9WbOqAGN0ET24nlWBZFT_e1inJ"
    ],
    leu_go_nho: [
      "https://lh3.googleusercontent.com/d/1k9S0bEbf9vPv5mhVjGjHrqsPRWEoX1F7",
      "https://lh3.googleusercontent.com/d/1B8YcHt5gbubJ3FD2OL2M-ooMB__UMwzz",
      "https://lh3.googleusercontent.com/d/1tkt8OKAdzsRPL-zYnKhvAY_jgKQJ589k"
    ],
  },
  bbq: [
    "https://lh3.googleusercontent.com/d/1yWOOq9MtOmL8NFxMD4T-kVN-GuxpNN9j",
    "https://lh3.googleusercontent.com/d/1t5oNO_sCUC9L2nuOnK0MZ3MIOBiHmS0j",
    "https://lh3.googleusercontent.com/d/17tCWj5HmVGnzZekhKhUKD4wNyngNz0uW"
  ],
  customer_experiences: [
    "https://lh3.googleusercontent.com/d/1TwbyuHeCa-KsLewnwUk47J-yixuSh_nh",
    "https://lh3.googleusercontent.com/d/1_HSRO1VBSGSwJ2i2Z8nanQUEq2FeYWHd",
    "https://lh3.googleusercontent.com/d/1JyJqnLpYvm5uxTF2n_rlF3yPV_yopNN6",
    "https://lh3.googleusercontent.com/d/15fnmW8PttduSd6bpf3aPW0bMW0nqAIxQ",
    "https://lh3.googleusercontent.com/d/1QzJWL6f3IWNICDsUiQWsQUZTfm3lVrDX",
    "https://lh3.googleusercontent.com/d/1QcBYz1vaegC3V55XfApIvEL9MxngiAr4",
    "https://lh3.googleusercontent.com/d/1gocujBa-evTK_ektVJSUaHJnBkP1NMAv",
    "https://lh3.googleusercontent.com/d/1hIlDgBPxEDxWsldti319ibaEQR2RSJBP"
  ]
};

const ROOM_TYPES = [
  {
    id: "nha-go",
    name: "NHÀ GỖ",
    images: IMAGES.rooms.nha_go,
    description: "Không gian ấm cúng, rộng rãi, riêng tư, phù hợp cho gia đình hoặc nhóm khách muốn nghỉ dưỡng thoải mái giữa thiên nhiên núi rừng.",
    prices: [
      { label: "Nhà gỗ 2 người", value: "2.200.000đ / căn" },
      { label: "Nhà gỗ 3 người", value: "2.300.000đ / căn" },
      { label: "Nhà gỗ 4 người", value: "2.400.000đ / căn" },
    ],
    amenities: ["Không gian riêng tư", "Phù hợp gia đình / nhóm bạn", "Toilet riêng", "Máy điều hòa", "Điểm tâm cà phê & bữa sáng", "Gần khu vực view và check-in"],
    capacity: "2 - 4 người"
  },
  {
    id: "phong-rieng",
    name: "PHÒNG RIÊNG",
    images: IMAGES.rooms.phong_rieng,
    description: "Lựa chọn tiện nghi, riêng tư, phù hợp cho cặp đôi hoặc khách muốn nghỉ ngơi thoải mái sau một ngày khám phá Bảo Lộc.",
    prices: [
      { label: "Phòng riêng 2 người", value: "1.100.000đ / căn" },
    ],
    amenities: ["Riêng tư", "Phù hợp cặp đôi", "Toilet riêng", "Máy điều hòa", "Điểm tâm cà phê & bữa sáng"],
    capacity: "2 người"
  },
  {
    id: "bungalow-1",
    name: "BUNGALOW KIỂU 1",
    images: IMAGES.rooms.bungalow_kieu_1,
    description: "Không gian thoáng, phù hợp gia đình nhỏ hoặc nhóm bạn, vừa có sự riêng tư vừa gần gũi với thiên nhiên và khu vực sinh hoạt chung.",
    prices: [
      { label: "Bungalow 2 người", value: "1.100.000đ / căn" },
      { label: "Bungalow 3 người", value: "1.350.000đ / căn" },
      { label: "Bungalow 4 người", value: "1.550.000đ / căn" },
    ],
    amenities: ["Phù hợp gia đình nhỏ / nhóm bạn", "Không gian thoáng", "Toilet riêng", "Máy điều hòa", "Điểm tâm cà phê & bữa sáng"],
    capacity: "2 - 4 người"
  },
  {
    id: "bungalow-2",
    name: "BUNGALOW KIỂU 2",
    images: IMAGES.rooms.bungalow_kieu_2,
    description: "Không gian thoáng, phù hợp gia đình nhỏ hoặc nhóm bạn, vừa có sự riêng tư vừa gần gũi với thiên nhiên và khu vực sinh hoạt chung.",
    prices: [
      { label: "Bungalow 2 người", value: "1.100.000đ / căn" },
      { label: "Bungalow 3 người", value: "1.350.000đ / căn" },
      { label: "Bungalow 4 người", value: "1.550.000đ / căn" },
    ],
    amenities: ["Phù hợp gia đình nhỏ / nhóm bạn", "Không gian thoáng", "Toilet riêng", "Máy điều hòa", "Điểm tâm cà phê & bữa sáng", "Gần khu vực BBQ và lửa trại"],
    capacity: "2 - 4 người"
  },
  {
    id: "leu-go",
    name: "LỀU GỖ NHỎ",
    images: IMAGES.rooms.leu_go_nho,
    description: "Lựa chọn nhỏ gọn, chill, gần gũi thiên nhiên, phù hợp khách trẻ thích trải nghiệm mới lạ và không gian mộc mạc trên núi.",
    prices: [
      { label: "Lều gỗ nhỏ 2 người", value: "600.000đ / căn" },
    ],
    amenities: ["Nhỏ gọn", "Gần gũi thiên nhiên", "Phù hợp 2 người", "Trải nghiệm chill", "Điểm tâm cà phê & bữa sáng"],
    capacity: "2 người",
    note: "Lều Gỗ Nhỏ không bao gồm máy điều hòa và toilet riêng."
  },
];

// --- COMPONENTS ---

const SectionTitle = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className={`text-center mb-12 sm:mb-16 px-4 ${light ? 'text-cream' : 'text-forest'}`}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-4 leading-tight italic"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`max-w-2xl mx-auto text-lg opacity-80 font-light`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Trang chủ", href: "#home" },
    { name: "Hạng phòng", href: "#rooms" },
    { name: "Bảng giá", href: "#pricing" },
    { name: "BBQ", href: "#bbq" },
    { name: "Trải nghiệm", href: "#experiences" },
    { name: "Liên hệ", href: "#contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-cream/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-wood shadow-lg shrink-0">
            <img src={BRAND_INFO.logo} alt={BRAND_INFO.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className={`text-base md:text-xl font-serif font-black tracking-tight leading-tight ${isScrolled || isMenuOpen ? 'text-forest' : 'text-cream shadow-black/20'}`}>
              HOMESTAY BÌNH MINH SĂN MÂY BẢO LỘC
            </span>
            <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold ${isScrolled || isMenuOpen ? 'text-wood' : 'text-cream/80'}`}>
              Thiên đường săn mây lý tưởng
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wider hover:text-wood transition-colors ${
                  isScrolled ? 'text-forest' : 'text-cream'
                }`}
              >
                {link.name}
              </a>
          ))}
          <a 
            href={`tel:${BRAND_INFO.phone}`}
            className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
              isScrolled 
                ? 'bg-forest text-cream hover:bg-wood' 
                : 'bg-cream text-forest hover:bg-wood hover:text-cream'
            }`}
          >
            Đặt phòng ngay
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled || isMenuOpen ? 'text-forest' : 'text-cream'}`}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-cream border-t border-forest/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl font-serif font-medium text-forest hover:text-wood border-b border-forest/5 pb-2"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href={`tel:${BRAND_INFO.phone}`}
                className="w-full py-4 bg-forest text-cream text-center rounded-xl font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
              >
                Đặt phòng: {BRAND_INFO.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGES.covers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Slider */}
      {IMAGES.covers.map((src, idx) => (
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentSlide === idx ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img src={src} className="w-full h-full object-cover" alt="Hero background" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-forest/60" />
        </motion.div>
      ))}

      {/* Content removed to show only photos as requested */}
      <div className="container relative z-10 mx-auto px-4 md:px-6 pointer-events-none">
        {/* We keep the container but empty of UI elements that block the view */}
      </div>

      {/* Hero Overlay Gradient for bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cream to-transparent z-[1]" />
    </section>
  );
};

const BookingBar = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 người');
  const [roomType, setRoomType] = useState('BUNGALOW KIỂU 1');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Authentication and Sheet Sync Status States
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const roomOptions = [
    "BUNGALOW KIỂU 1",
    "BUNGALOW KIỂU 2",
    "NHÀ GỖ",
    "PHÒNG RIÊNG",
    "LỀU GỖ NHỎ"
  ];

  const currentZaloString = BRAND_INFO.zalo.replace(/\s/g, '');
  const promptMessage = `Chào Bình Minh Săn Mây, tôi muốn gửi yêu cầu kiểm tra phòng như sau:\n` +
    `- Họ tên: ${fullName}\n` +
    `- Số điện thoại: ${phone}\n` +
    `- Ngày check-in: ${checkIn}\n` +
    `- Ngày check-out: ${checkOut || 'Chưa xác định'}\n` +
    `- Số lượng khách: ${guests}\n` +
    `- Hạng phòng: ${roomType}\n` +
    `- Ghi chú: ${notes || 'Không có'}`;

  const zaloHref = `https://zalo.me/${currentZaloString}`;

  const formatToVN = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !checkIn.trim()) {
      return;
    }
    setIsSubmitted(true);

    if (token) {
      setSheetStatus('sending');
      const d = new Date();
      const timeStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
      
      const success = await appendBookingToSheet({
        time: timeStr,
        fullName,
        phone,
        guests,
        checkIn: formatToVN(checkIn),
        checkOut: formatToVN(checkOut) || 'Không có',
        roomType,
        notes: notes || 'Không có'
      }, token);

      if (success) {
        setSheetStatus('success');
      } else {
        setSheetStatus('error');
      }
    }
  };

  const handleCopyAndRedirect = () => {
    navigator.clipboard.writeText(promptMessage).then(() => {
      window.open(zaloHref, '_blank');
    }).catch(() => {
      window.open(zaloHref, '_blank');
    });
  };

  return (
    <section id="check-room" className="relative z-20 -mt-16 md:-mt-24 px-4 pb-12">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-forest/10 shadow-2xl rounded-[32px] p-6 md:p-8"
        >
          {/* Connection Status Bar for Admin/Google Sheets */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs py-3.5 px-4 rounded-2xl bg-cream/50 border border-forest/10 mb-6 gap-3">
            <div className="flex items-center gap-2 text-forest/80 font-sans">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${token ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
              <span className="leading-relaxed">
                {token ? (
                  <>Đã kết nối Google Sheet: <strong className="text-forest">LANGDING PAGE BÌNH MINH (langdingpage 01)</strong></>
                ) : (
                  <>Google Sheet chưa kết nối. Vui lòng liên kết để đồng bộ dữ liệu vào trang tính.</>
                )}
              </span>
            </div>
            <div className="shrink-0">
              {token ? (
                <div className="flex items-center gap-3">
                  <span className="text-forest/60 select-none">Admin: {user?.displayName || user?.email}</span>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      await logout();
                      setUser(null);
                      setToken(null);
                    }}
                    className="text-red-600 hover:text-red-800 underline font-medium cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsLoggingIn(true);
                    try {
                      const res = await googleSignIn();
                      if (res) {
                        setUser(res.user);
                        setToken(res.accessToken);
                      }
                    } catch (err) {
                      console.error("Popup authentication failed:", err);
                    } finally {
                      setIsLoggingIn(false);
                    }
                  }}
                  disabled={isLoggingIn}
                  className="px-4 py-2 bg-forest hover:bg-wood text-cream font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 text-[11px]"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  {isLoggingIn ? 'Đang liên kết...' : 'Kết nối Google Sheet'}
                </button>
              )}
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center md:text-left border-b border-forest/10 pb-4 mb-2">
                <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-wood font-mono">Đăng ký giữ chỗ</span>
                <h3 className="text-2xl font-serif font-bold text-forest mt-1">ĐIỀN THÔNG TIN KIỂM TRA PHÒNG</h3>
                <p className="text-xs text-forest/60 mt-1 italic font-sans">Vui lòng điền thông tin để Bình Minh Săn Mây kiểm tra phòng trống và hỗ trợ bạn sớm nhất.</p>
              </div>

              {/* Grid Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Họ tên */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs uppercase tracking-wider font-bold text-forest/70 flex items-center gap-1.5 font-sans">
                    <User size={14} className="text-wood" /> Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/50 border border-forest/10 rounded-2xl text-forest outline-none focus:border-wood transition-colors placeholder:text-forest/30 text-sm font-sans"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs uppercase tracking-wider font-bold text-forest/70 flex items-center gap-1.5 font-sans">
                    <Phone size={14} className="text-wood" /> Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/50 border border-forest/10 rounded-2xl text-forest outline-none focus:border-wood transition-colors placeholder:text-forest/30 text-sm font-sans"
                  />
                </div>

                {/* Số lượng khách */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs uppercase tracking-wider font-bold text-forest/70 flex items-center gap-1.5 font-sans">
                    <Star size={14} className="text-wood" /> Số lượng khách
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/50 border border-forest/10 rounded-2xl text-forest focus:border-wood outline-none transition-colors text-sm font-sans"
                  >
                    <option value="1 người">1 người</option>
                    <option value="2 người">2 người</option>
                    <option value="3 người">3 người</option>
                    <option value="4 người">4 người</option>
                    <option value="Nhóm (5 người)">Nhóm (5 người)</option>
                    <option value="Nhóm (6 - 10 người)">Nhóm (6 - 10 người)</option>
                    <option value="Gia đình lớn">Gia đình lớn</option>
                  </select>
                </div>

                {/* Ngày Check In */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs uppercase tracking-wider font-bold text-forest/70 flex items-center gap-1.5 font-sans">
                    <Calendar size={14} className="text-wood" /> Ngày check-in <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/50 border border-forest/10 rounded-2xl text-forest focus:border-wood outline-none transition-colors text-sm font-sans"
                  />
                </div>

                {/* Ngày Check Out */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs uppercase tracking-wider font-bold text-forest/70 flex items-center gap-1.5 font-sans">
                    <Calendar size={14} className="text-wood" /> Ngày check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/50 border border-forest/10 rounded-2xl text-forest focus:border-wood outline-none transition-colors text-sm font-sans"
                  />
                </div>

                {/* Hạng phòng */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs uppercase tracking-wider font-bold text-forest/70 flex items-center gap-1.5 font-sans">
                    <Info size={14} className="text-wood" /> Hạng phòng
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-3 bg-cream/50 border border-forest/10 rounded-2xl text-forest focus:border-wood outline-none transition-colors text-sm font-medium font-sans"
                  >
                    {roomOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs uppercase tracking-wider font-bold text-forest/70 flex items-center gap-1.5 font-sans">
                  <MessageCircle size={14} className="text-wood" /> Ghi chú (Ví dụ: Giờ đến dự kiến, yêu cầu nướng BBQ...)
                </label>
                <textarea
                  placeholder="Nhập ghi chú hoặc yêu cầu của bạn tại đây..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-cream/50 border border-forest/10 rounded-2xl text-forest focus:border-wood outline-none transition-colors placeholder:text-forest/30 text-sm resize-none font-sans"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-12 py-4 bg-wood hover:bg-forest text-cream font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group text-sm md:text-base cursor-pointer"
                >
                  GỬI YÊU CẦU KIỂM TRA PHÒNG
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-6"
            >
              <div className="inline-flex p-4 bg-green-50 text-green-600 rounded-full">
                <CheckCircle2 size={48} className="animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-forest uppercase">Đã ghi nhận thông tin yêu cầu!</h3>
                {token ? (
                  <div className="text-xs max-w-md mx-auto pt-1 font-sans">
                    {sheetStatus === 'sending' && (
                      <span className="text-amber-600 font-medium animate-pulse">⏳ Đang gửi dữ liệu đăng phòng lên Google Sheet...</span>
                    )}
                    {sheetStatus === 'success' && (
                      <span className="text-emerald-600 font-bold">🟢 Đã lưu vào sheet "langdingpage 01" thành công!</span>
                    )}
                    {sheetStatus === 'error' && (
                      <span className="text-rose-600 font-semibold">🔴 Lỗi khi lưu vào Google Sheet. Admin vui lòng kiểm tra quyền truy cập.</span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 font-medium italic font-sans">
                    Google Sheet chưa liên kết, thông tin hiện được lưu trữ cục bộ.
                  </p>
                )}
                <p className="text-sm text-forest/80 max-w-md mx-auto font-sans pt-1">
                  Để nhận phản hồi trực tiếp 24/7 và kiểm tra phòng tức thời, vui lòng ấn nút dưới đây để gửi trực tiếp thông tin đến Zalo.
                </p>
              </div>

              {/* Box review message before sending */}
              <div className="bg-cream/40 border border-forest/5 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2 text-forest/90 font-mono">
                <div className="font-bold border-b border-forest/10 pb-1 text-forest mb-2 font-sans text-sm">Nội dung đăng ký:</div>
                <p><span className="font-sans font-semibold text-forest/60">Họ tên:</span> {fullName}</p>
                <p><span className="font-sans font-semibold text-forest/60">Số điện thoại:</span> {phone}</p>
                <p><span className="font-sans font-semibold text-forest/60">Check-in:</span> {formatToVN(checkIn)}</p>
                <p><span className="font-sans font-semibold text-forest/60">Check-out:</span> {formatToVN(checkOut) || 'Chưa xác định'}</p>
                <p><span className="font-sans font-semibold text-forest/60">Số lượng khách:</span> {guests}</p>
                <p><span className="font-sans font-semibold text-forest/60">Hạng phòng:</span> {roomType}</p>
                <p><span className="font-sans font-semibold text-forest/60">Ghi chú:</span> {notes || 'Không có'}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={handleCopyAndRedirect}
                  className="flex-1 px-6 py-3.5 bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <MessageCircle size={18} />
                  MỞ ZALO GỬI THÔNG TIN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFullName('');
                    setPhone('');
                    setNotes('');
                    setSheetStatus('idle');
                  }}
                  className="px-6 py-3.5 bg-cream hover:bg-forest/5 text-forest border border-forest/10 font-medium rounded-xl transition-colors text-sm cursor-pointer"
                >
                  Làm mới form
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-4 gap-x-8">
          <div className="flex items-center gap-2 text-forest/60 text-sm font-medium italic">
            <CheckCircle2 size={16} className="text-wood" />
            <span>Hoàn hủy linh hoạt</span>
          </div>
          <div className="flex items-center gap-2 text-forest/60 text-sm font-medium italic">
            <CheckCircle2 size={16} className="text-wood" />
            <span>Ưu đãi đặt sớm 10%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Intro = () => {
  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-wood/10 rounded-2xl -rotate-2 scale-105 group-hover:rotate-0 transition-transform duration-500" />
              <img 
                src={IMAGES.covers[1]} 
                alt="Intro view" 
                className="relative rounded-2xl shadow-2xl z-10 aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 glass-dark p-6 rounded-xl z-20 hidden md:block border-wood/20 border">
                 <div className="flex flex-col items-center text-cream">
                    <span className="text-3xl font-serif italic font-bold">1000m+</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-80">Độ cao săn mây</span>
                 </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="lg:w-1/2"
          >
            <span className="text-wood font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Về chúng tôi</span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-8 leading-tight italic text-forest">
               Bình Minh Săn Mây – Tọa Độ Nghỉ Dưỡng Không Thể Bỏ Lỡ Tại Bảo Lộc
            </h2>
            <div className="space-y-6 text-forest/80 text-lg font-light leading-relaxed mb-8">
              <p>
                Bình Minh Săn Mây không chỉ là nơi lưu trú, mà là một hành trình nghỉ dưỡng trọn vẹn giữa thiên nhiên hùng vĩ của núi rừng Tây Nguyên.
              </p>
              <p>
                Tại đây, mỗi ngày của bạn đều bắt đầu bằng khoảnh khắc chạm tay vào biển mây bồng bềnh ngay trước cửa phòng. Ban ngày tận hưởng bầu không khí se lạnh, trong lành đặc trưng của Bảo Lộc. Khi chiều buông, hãy cùng người thân ngắm hoàng hôn rực rỡ và kết thúc ngày bằng bữa tiệc BBQ ấm cúng, đốt lửa trại và ngắm toàn cảnh thành phố lung linh ánh đèn từ trên cao.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { icon: <CloudSun size={20} />, text: "Săn mây sớm" },
                  { icon: <MapPin size={20} />, text: "View núi 360°" },
                  { icon: <Flame size={20} />, text: "BBQ & Lửa trại" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-forest font-medium">
                    <div className="text-wood">{item.icon}</div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const RoomCard = ({ room }: { room: any }) => {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-forest/5 flex flex-col h-full group"
    >
      {/* Mini Gallery */}
      <div className="relative h-72 md:h-80 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key={room.images[activeImg]}
            src={room.images[activeImg]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover"
            alt={room.name}
          />
        </AnimatePresence>
        
        {/* Gallery Controls */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
          {room.images.map((_: any, idx: number) => (
            <button 
              key={idx}
              onClick={(e) => { e.preventDefault(); setActiveImg(idx); }}
              className={`w-2 h-2 rounded-full transition-all ${activeImg === idx ? 'bg-cream w-6' : 'bg-cream/40'}`}
            />
          ))}
        </div>

        {/* Capacity Badge */}
        <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold text-cream uppercase tracking-widest border-cream/20">
          {room.capacity}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-serif font-bold text-forest mb-3 italic">{room.name}</h3>
        <p className="text-forest/70 font-light mb-6 line-clamp-3 leading-relaxed">
          {room.description}
        </p>

        {/* Prices List */}
        <div className="space-y-3 mb-8">
          {room.prices.map((p: any, i: number) => (
            <div key={i} className="flex justify-between items-center text-sm border-b border-forest/5 pb-2 last:border-0 italic">
              <span className="text-forest/60">{p.label}</span>
              <span className="text-wood font-bold text-lg">{p.value}</span>
            </div>
          ))}
        </div>

        {/* Amenities Icons */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
            {room.amenities.slice(0, 4).map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-forest/70">
                <div className="w-1.5 h-1.5 rounded-full bg-wood shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
        </div>

        {room.note && (
           <div className="mb-8 p-3 bg-wood/5 border border-wood/10 rounded-xl flex gap-3 italic">
              <Info size={16} className="text-wood shrink-0 mt-0.5" />
              <span className="text-xs text-wood leading-relaxed font-medium">{room.note}</span>
           </div>
        )}

        <div className="mt-auto space-y-3">
          <a 
            href={`https://zalo.me/${BRAND_INFO.zalo.replace(/\s/g, '')}`}
            className="block w-full py-3.5 bg-forest text-cream text-center rounded-2xl font-bold uppercase tracking-widest hover:bg-wood transition-colors shadow-lg shadow-forest/10"
          >
            Tư vấn phòng này
          </a>
          <button className="block w-full py-3 text-forest/60 text-sm font-medium hover:text-wood transition-colors italic">
             Xem chi tiết & ảnh phòng
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PricingTable = () => {
    return (
        <section id="pricing" className="py-24 bg-cream">
            <div className="container mx-auto px-4">
                <SectionTitle 
                    title="Bảng Giá Dịch Vụ Lưu Trú" 
                    subtitle="Lựa chọn không gian nghỉ dưỡng phù hợp với nhu cầu của bạn." 
                />

                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-forest/5 italic">
                    <div className="bg-forest px-8 py-6">
                        <div className="grid grid-cols-2 gap-4 text-cream font-bold uppercase tracking-widest text-xs">
                           <span>Hạng phòng / Sức chứa</span>
                           <span className="text-right">Giá phòng (VND)</span>
                        </div>
                    </div>
                    <div className="divide-y divide-forest/5">
                        {[
                           { name: "Nhà gỗ 2 người", price: "2.200.000đ" },
                           { name: "Nhà gỗ 3 người", price: "2.300.000đ" },
                           { name: "Nhà gỗ 4 người", price: "2.400.000đ" },
                           { name: "Phòng riêng 2 người", price: "1.100.000đ" },
                           { name: "Bungalow kiểu 1 - 2 người", price: "1.100.000đ" },
                           { name: "Bungalow kiểu 1 - 3 người", price: "1.350.000đ" },
                           { name: "Bungalow kiểu 1 - 4 người", price: "1.550.000đ" },
                           { name: "Bungalow kiểu 2 - 2 người", price: "1.100.000đ" },
                           { name: "Bungalow kiểu 2 - 3 người", price: "1.350.000đ" },
                           { name: "Bungalow kiểu 2 - 4 người", price: "1.550.000đ" },
                           { name: "Lều gỗ nhỏ 2 người", price: "600.000đ" },
                        ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-2 px-8 py-5 hover:bg-wood/5 transition-colors group">
                                <span className="font-medium text-forest group-hover:text-wood transition-colors">{row.name}</span>
                                <span className="text-right font-bold text-forest">{row.price}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 bg-cream/30 text-center border-t border-forest/5">
                        <a 
                            href={`https://zalo.me/${BRAND_INFO.zalo.replace(/\s/g, '')}`}
                            className="inline-flex items-center gap-2 text-wood font-bold uppercase tracking-widest hover:underline"
                        >
                            <MessageCircle size={20} />
                            Kiểm tra phòng trống qua Zalo
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

const IncludedServices = () => {
    const services = [
        { icon: <CloudSun />, title: "Săn mây mỗi sáng", desc: "View triệu đô ngay tại phòng" },
        { icon: <Flame />, title: "Lửa trại tối", desc: "Ấm cúng giữa không khí lạnh" },
        { icon: <Coffee />, title: "Điểm tâm & Cà phê", desc: "Bữa sáng trọn gói mỗi ngày" },
        { icon: <Wifi />, title: "Wifi tốc độ cao", desc: "Phủ sóng toàn khu vực" },
        { icon: <Star />, title: "Tiện ích cá nhân", desc: "Đầy đủ khăn, bàn chải, máy sấy" },
        { icon: <Car />, title: "Trung chuyển", desc: "Miễn phí xe trung chuyển" },
    ];

    return (
        <section className="py-24 bg-forest text-cream">
            <div className="container mx-auto px-4">
                <SectionTitle title="Tiện ích đã bao gồm" subtitle="Chúng tôi chăm chút từng chi tiết để kỳ nghỉ của bạn trở nên trọn vẹn nhất." light />
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
                    {services.map((s, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col items-center text-center space-y-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-cream/10 flex items-center justify-center text-wood border border-cream/10">
                                {s.icon}
                            </div>
                            <div>
                                <h4 className="text-lg font-serif font-bold italic mb-1">{s.title}</h4>
                                <p className="text-cream/60 text-sm font-light">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const BBQSection = () => {
    return (
        <section id="bbq" className="py-24 bg-cream overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <img src={IMAGES.bbq[0]} className="w-full h-80 object-cover rounded-3xl shadow-xl" alt="BBQ 1" />
                            </div>
                            <img src={IMAGES.bbq[1]} className="w-full h-48 object-cover rounded-3xl shadow-xl" alt="BBQ 2" />
                            <img src={IMAGES.bbq[2]} className="w-full h-48 object-cover rounded-3xl shadow-xl" alt="BBQ 3" />
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-block px-4 py-1 bg-wood/10 rounded-full mb-6 italic">
                            <span className="text-wood font-bold uppercase tracking-widest text-xs">Trải nghiệm ẩm thực</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium mb-8 leading-tight italic text-forest">
                            BBQ TRÊN CAO – NGẮM BẢO LỘC LUNG LINH VỀ ĐÊM
                        </h2>
                        <div className="space-y-6 text-forest/80 text-lg font-light leading-relaxed mb-10">
                            <p>
                                Khi màn đêm buông xuống, tại sao không cùng những người thân yêu xua tan cái se lạnh vùng cao bằng một bữa tiệc nướng nóng hổi?
                            </p>
                            <p>
                                Với không gian ngoài trời thoáng đãng, từ vị trí BBQ bạn có thể thu trọn vào tầm mắt toàn cảnh thành phố Bảo Lộc lấp lánh như hàng ngàn ngôi sao dưới mặt đất. Một không gian lãng mạn cho cặp đôi, hay ấm cúng cho gia đình và nhóm bạn.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-forest/5 mb-10 italic">
                            <div className="flex justify-between items-center mb-6">
                                <div className="space-y-1">
                                    <span className="block text-forest/50 text-sm uppercase tracking-wider font-bold">Giá dịch vụ</span>
                                    <span className="text-3xl font-serif font-bold text-wood">270.000đ <span className="text-lg text-forest/40">/ khách</span></span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-forest/50 text-sm uppercase tracking-wider font-bold">Thời gian</span>
                                    <span className="text-lg font-serif font-bold text-forest">17:00 – 21:30</span>
                                </div>
                            </div>
                            <ul className="grid grid-cols-2 gap-3 mb-8">
                                {["Thực đơn đa dạng", "Thực phẩm tươi mới", "Phục vụ tận tình", "View cực phẩm"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-forest/70">
                                        <CheckCircle2 size={16} className="text-wood" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <a 
                                href={`https://zalo.me/${BRAND_INFO.zalo.replace(/\s/g, '')}`}
                                className="block w-full py-4 bg-wood hover:bg-forest text-cream text-center rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-wood/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Đặt BBQ ngay <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const ExperienceGrid = () => {
    const items = [
        { title: "Săn mây lúc bình minh", desc: "Hít hà không khí sớm mai, chạm tay vào biển mây ngay trước mắt.", icon: <CloudSun /> },
        { title: "Ngắm toàn cảnh Bảo Lộc", desc: "View bao trọn núi đồi và thành phố từ độ cao cực phẩm.", icon: <MapPin /> },
        { title: "Chill cà phê sáng", desc: "Thưởng thức ly cà phê Bảo Lộc đậm đà giữa thiên nhiên mát lành.", icon: <Coffee /> },
        { title: "BBQ & Chill", desc: "Đồ nướng nóng hổi, ngắm ánh đèn thành phố bừng sáng về đêm.", icon: <Flame /> },
        { title: "Hoàng hôn trên núi", desc: "Khoảnh khắc lãng mạn khi mặt trời lặn sau những rặng núi mờ sương.", icon: <CloudSun /> },
        { title: "Lửa trại ấm cúng", desc: "Cùng nhau trò chuyện bên ánh lửa hồng giữa cái se lạnh của phố núi.", icon: <Flame /> },
    ];

    return (
        <section id="experiences" className="py-24 bg-cream">
            <div className="container mx-auto px-4">
                <SectionTitle title="Những trải nghiệm khó quên" subtitle="Mỗi giây phút tại Bình Minh Săn Mây đều là một kỷ niệm đáng giá." />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-10 rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-500 border border-forest/5 flex flex-col items-center text-center group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-wood/10 text-wood flex items-center justify-center mb-6 group-hover:bg-forest group-hover:text-cream transition-colors duration-500">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-serif font-bold text-forest italic mb-4">{item.title}</h4>
                            <p className="text-forest/60 font-light leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const reviews = [
        { name: "Anh Minh", text: "Sáng mở cửa ra thấy mây ngay trước mắt, cảm giác rất đáng nhớ. Phòng sạch và nhân viên thân thiện." },
        { name: "Chị Thảo", text: "Buổi tối ăn BBQ nhìn xuống thành phố Bảo Lộc lên đèn rất chill. Rất phù hợp để trốn cái nóng thành phố." },
        { name: "Bạn Linh", text: "Gia đình mình rất thích không gian lửa trại và view núi. Có xe trung chuyển miễn phí rất tiện." },
        { name: "Anh Quân", text: "Đi cuối tuần cực kỳ đáng, vừa nghỉ ngơi vừa có nhiều góc check-in xịn sò cho người yêu mình." },
    ];

    return (
        <section className="py-24 bg-cream overflow-hidden">
            <div className="container mx-auto px-4">
                <SectionTitle title="Cảm nhận từ khách hàng" subtitle="Hàng nghìn khách hàng đã đến và hài lòng với trải nghiệm tại đây." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto italic">
                    {reviews.map((r, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl shadow-md border border-forest/5 flex flex-col"
                        >
                            <div className="flex gap-1 text-sunset mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <p className="text-forest/80 text-lg font-light mb-6 flex-grow leading-relaxed">"{r.text}"</p>
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-wood/20 flex items-center justify-center font-serif text-wood font-bold">
                                    {r.name[0]}
                                </div>
                                <span className="font-bold text-forest">{r.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const CustomerExperienceGallery = () => {
    const [selectedImgIdx, setSelectedImgIdx] = useState<number | null>(null);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImgIdx !== null) {
            setSelectedImgIdx((selectedImgIdx - 1 + IMAGES.customer_experiences.length) % IMAGES.customer_experiences.length);
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImgIdx !== null) {
            setSelectedImgIdx((selectedImgIdx + 1) % IMAGES.customer_experiences.length);
        }
    };

    return (
        <section id="customer-gallery" className="py-24 bg-white relative">
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-wood/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-forest/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                <SectionTitle 
                    title="Khoảnh Khắc Trải Nghiệm Khách Hàng" 
                    subtitle="Hình ảnh chân thực được sẻ chia từ những vị khách quý trong suốt hành trình săn mây và nghỉ dưỡng." 
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {IMAGES.customer_experiences.map((src, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedImgIdx(idx)}
                            className="relative aspect-square rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group bg-forest/5"
                        >
                            <img 
                                src={src} 
                                alt={`Trải nghiệm khách hàng ${idx + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="p-3 bg-cream/90 text-forest rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <Camera size={20} className="text-wood" />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedImgIdx !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImgIdx(null)}
                        className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <button 
                            className="absolute top-6 right-6 text-cream/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                            onClick={() => setSelectedImgIdx(null)}
                        >
                            <X size={32} />
                        </button>

                        <button 
                            className="absolute left-4 md:left-8 text-cream/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
                            onClick={handlePrev}
                        >
                            <ChevronLeft size={36} />
                        </button>

                        <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
                            <motion.img 
                                key={selectedImgIdx}
                                src={IMAGES.customer_experiences[selectedImgIdx]} 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                                alt={`Trải nghiệm khách hàng ${selectedImgIdx + 1}`}
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-[-40px] text-cream/70 text-sm font-light">
                                Hình ảnh {selectedImgIdx + 1} / {IMAGES.customer_experiences.length}
                            </div>
                        </div>

                        <button 
                            className="absolute right-4 md:right-8 text-cream/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
                            onClick={handleNext}
                        >
                            <ChevronRight size={36} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const FAQ = () => {
    const faqs = [
        { q: "Có săn mây được vào mọi thời điểm không?", a: "Săn mây phụ thuộc vào thời tiết nhưng tại chỗ chúng tôi, mây thường xuất hiện rất đẹp vào buổi sớm (khoảng 5:00 - 7:00 sáng) đặc biệt là vào những ngày lặng gió." },
        { q: "Giá phòng đã bao gồm bãi đậu xe chưa?", a: "Dạ rồi ạ. Chúng tôi có bãi đậu xe rộng rãi và miễn phí cho khách lưu trú." },
        { q: "BBQ 270k/người bao gồm những gì?", a: "Set BBQ bao gồm các loại thịt, hải sản tươi ngon, rau củ nướng, salad và các món ăn kèm đặc trưng của vùng núi Bảo Lộc." },
        { q: "Có phù hợp cho gia đình có trẻ em không?", a: "Hoàn toàn phù hợp ạ. Không gian rộng rãi, thoáng mát rất thích hợp cho các bé trải nghiệm thiên nhiên." },
    ];

    return (
        <section className="py-24 bg-cream">
            <div className="container mx-auto px-4 max-w-4xl italic">
                <SectionTitle title="Những câu hỏi thường gặp" />
                
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.details 
                            key={i}
                            className="group bg-white rounded-2xl shadow-sm border border-forest/5 overflow-hidden"
                        >
                            <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-forest group-open:text-wood transition-colors">
                                <span className="text-lg">{faq.q}</span>
                                <PlusIcon className="group-open:rotate-45 transition-transform" />
                            </summary>
                            <div className="px-6 pb-6 text-forest/70 font-light leading-relaxed border-t border-forest/5 pt-4">
                                {faq.a}
                            </div>
                        </motion.details>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const ContactCTA = () => {
  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
            <img src={IMAGES.covers[2]} className="w-full h-full object-cover" alt="Footer bg" />
            <div className="absolute inset-0 bg-forest/80 backdrop-blur-sm" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto text-cream"
            >
                <h2 className="text-4xl md:text-6xl font-serif font-medium mb-8 leading-tight italic">
                   BẠN ĐÃ SẴN SÀNG THỨC DẬY GIỮA BIỂN MÂY BẢO LỘC CHƯA?
                </h2>
                <p className="text-xl font-light mb-12 opacity-80 max-w-2xl mx-auto">
                    Chọn hạng phòng phù hợp, đặt lịch nghỉ dưỡng và để Bình Minh Săn Mây chuẩn bị cho bạn một chuyến đi thật đáng nhớ.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a 
                        href={`tel:${BRAND_INFO.phone}`}
                        className="w-full sm:w-auto px-10 py-5 bg-wood hover:bg-cream hover:text-forest text-cream font-bold rounded-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        <Phone size={24} />
                        Gọi ngay: {BRAND_INFO.phone}
                    </a>
                    <a 
                        href={`https://zalo.me/${BRAND_INFO.zalo.replace(/\s/g, '')}`}
                        className="w-full sm:w-auto px-10 py-5 glass hover:bg-cream hover:text-forest text-cream font-bold rounded-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        <MessageCircle size={24} />
                        Nhắn Zalo Tư Vấn
                    </a>
                </div>

                <div className="mt-12 space-y-4 text-cream/70 text-sm">
                    <a 
                        href={BRAND_INFO.maps} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-center gap-2 hover:text-wood transition-colors group"
                    >
                        <MapPin size={16} className="text-wood group-hover:scale-110 transition-transform" />
                        <span className="hover:underline">{BRAND_INFO.address}</span>
                    </a>
                    <div className="flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-wood" />
                            <span>Check-in: 14:00</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-wood" />
                            <span>Check-out: 12:00</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
  )
}

const Footer = () => {
    return (
        <footer className="bg-cream pt-20 pb-10 italic">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-wood shadow-sm shrink-0">
                                <img src={BRAND_INFO.logo} alt={BRAND_INFO.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-serif font-bold text-forest tracking-tight">
                                    BÌNH MINH SĂN MÂY
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-wood">
                                    BẢO LỘC MOUNTAIN HOMESTAY
                                </span>
                            </div>
                        </div>
                        <p className="text-forest/60 font-light leading-relaxed mb-6">
                            Bình Minh Săn Mây tự hào mang đến trải nghiệm lưu trú và nghỉ dưỡng đẳng cấp giữa thiên nhiên núi rừng Bảo Lộc.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-forest font-bold uppercase tracking-widest text-sm mb-6">Menu nhanh</h4>
                        <ul className="space-y-4 text-forest/60">
                            {["Trang chủ", "Hạng phòng", "Bảng giá", "BBQ", "Trải nghiệm", "Liên hệ"].map((item, i) => (
                                <li key={i}><a href={`#${item.toLowerCase()}`} className="hover:text-wood transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-forest font-bold uppercase tracking-widest text-sm mb-6">Thông tin liên hệ</h4>
                        <ul className="space-y-4 text-forest/60">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-wood shrink-0 mt-1" />
                                <a 
                                    href={BRAND_INFO.maps} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="hover:text-wood hover:underline decoration-wood/30 transition-colors"
                                >
                                    {BRAND_INFO.address}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-wood shrink-0" />
                                <span>{BRAND_INFO.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle size={18} className="text-wood shrink-0" />
                                <span>Zalo: {BRAND_INFO.zalo}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-forest font-bold uppercase tracking-widest text-sm mb-6">Kết nối</h4>
                        <div className="flex gap-4">
                            <a href={BRAND_INFO.fanpage} className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center hover:bg-wood transition-colors">
                                <ChevronRight size={20} />
                            </a>
                            <a href={BRAND_INFO.maps} className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center hover:bg-wood transition-colors">
                                <MapPin size={20} />
                            </a>
                        </div>
                        <div className="mt-8">
                            <a 
                                href={`https://zalo.me/${BRAND_INFO.zalo.replace(/\s/g, '')}`}
                                className="inline-flex py-3 px-6 glass-dark text-cream rounded-2xl items-center gap-3 font-bold text-xs uppercase tracking-[0.2em]"
                            >
                                <MessageCircle size={18} />
                                Nhắn Zalo
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-forest/10 flex flex-col md:flex-row justify-between items-center text-xs text-forest/40 uppercase tracking-[0.2em] font-medium transition-colors">
                    <p>© 2026 Bình Minh Săn Mây Bảo Lộc. All rights reserved.</p>
                    <p className="mt-4 md:mt-0">Thiết kế bởi HoangDat Luxury Landing Page</p>
                </div>
            </div>
        </footer>
    );
};

const FloatingButtons = () => {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4">
            <motion.a 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={`https://zalo.me/${BRAND_INFO.zalo.replace(/\s/g, '')}`}
                className="w-16 h-16 bg-[#0068FF] text-white rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group"
            >
                <MessageCircle size={28} />
                <span className="absolute -left-32 bg-[#0068FF] text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 hidden md:block">Nhắn Zalo</span>
            </motion.a>
            <motion.a 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={`tel:${BRAND_INFO.phone}`}
                className="w-16 h-16 bg-wood text-white rounded-full flex items-center justify-center shadow-2xl group overflow-hidden"
            >
                <Phone size={28} />
                <span className="absolute -left-32 bg-wood text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 hidden md:block">Gọi điện ngay</span>
            </motion.a>
        </div>
    )
}

export default function App() {
  return (
    <div className="relative selection:bg-wood selection:text-cream scroll-smooth">
      <Navbar />
      
      <main>
        {/* Section 2: Hero */}
        <Hero />
        <BookingBar />

        {/* Section 3: Intro */}
        <Intro />

        {/* Section 4: Hạng phòng */}
        <section id="rooms" className="py-24 bg-white relative">
          {/* Subtle bg decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-wood/5 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-forest/5 rounded-full blur-[100px] -z-10" />

          <div className="container mx-auto px-4 md:px-6">
            <SectionTitle 
              title="Khám Phá Các Hạng Phòng" 
              subtitle="Mỗi căn phòng đều được thiết kế để mang lại sự ấm cúng và khoảnh khắc săn mây hoàn hảo nhất." 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
              {ROOM_TYPES.map((room) => (
                <div key={room.id}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Bảng giá tóm tắt */}
        <PricingTable />

        {/* Section 6: Tiện ích đã bao gồm */}
        <IncludedServices />

        {/* Section 7: BBQ Buổi tối */}
        <BBQSection />

        {/* Section 8: Trải nghiệm nổi bật */}
        <ExperienceGrid />

        {/* Section 10: Vì sao chọn chúng tôi (Combined into grid & intro implicitly, but can add specifically) */}
        
        {/* Section 11: Đánh giá khách hàng */}
        <Testimonials />

        {/* Section 11.5: Ảnh Trải nghiệm khách hàng */}
        <CustomerExperienceGallery />

        {/* Section 12: FAQ */}
        <FAQ />

        {/* Section 13: Liên hệ / CTA cuối trang */}
        <ContactCTA />
      </main>

      <Footer />
      
      {/* Floating Action Buttons */}
      <FloatingButtons />
    </div>
  );
}
