import { useState, useRef, useEffect } from "react";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .genre-scroll-container::-webkit-scrollbar { display: none; }
    html, body { overflow-x: hidden; max-width: 100vw; }
  `;
  document.head.appendChild(style);
}

// ─── DATA ───────────────────────────────────────────────────────────────────
const QA_SUGGESTIONS = [
  'Summarize "Meditations"',
  "Compare Stoicism and modern self-help",
  'Analyze themes in "The Alchemist"',
  "What books deal with decision-making?",
];

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-500" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function SideNav({ page, setPage }) {
  const navItems = [
    { id: "dashboard", label: "Library", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" /></svg>
    )},
    { id: "qa", label: "Ask AI", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
    )},
    { id: "detail", label: "Book", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
    )},
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-16 flex flex-col items-center py-6 z-50"
      style={{ background: "#ffffff", borderRight: "1px solid #e5e7eb" }}>
      <div className="mb-8 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {navItems.map((item) => (
        <button key={item.id}
          onClick={() => setPage(item.id)}
          title={item.label}
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-200 ${
            page === item.id ? "text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
          style={page === item.id ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" } : {}}>
          {item.icon}
        </button>
      ))}
      <div className="mt-auto">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
        </button>
      </div>
    </nav>
  );
}

// ─── SCROLLABLE GENRE TABS ───────────────────────────────────────────────────
function GenreTabs({ genres, filter, setFilter }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    element?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      element?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [genres]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  return (
    // KEY FIX: min-w-0 + overflow-hidden on the outer wrapper prevents it from stretching the page
    <div className="flex items-center gap-2 min-w-0 overflow-hidden w-full">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
        style={{
          background: canScrollLeft ? "#f3f4f6" : "#f9fafb",
          border: canScrollLeft ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
          color: canScrollLeft ? "#6b7280" : "#d1d5db",
          cursor: canScrollLeft ? "pointer" : "not-allowed",
        }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Scrollable pill container — overflow hidden externally, scroll internally */}
      <div
        ref={scrollRef}
        className="genre-scroll-container flex gap-2 min-w-0"
        style={{
          flex: "1 1 0%",
          overflowX: "auto",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
            style={
              filter === g
                ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#ffffff", border: "1px solid transparent" }
                : { background: "#f9fafb", color: "#6b7280", border: "1px solid #e5e7eb" }
            }>
            {g}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
        style={{
          background: canScrollRight ? "#f3f4f6" : "#f9fafb",
          border: canScrollRight ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
          color: canScrollRight ? "#6b7280" : "#d1d5db",
          cursor: canScrollRight ? "pointer" : "not-allowed",
        }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5L15.75 12l-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

// ─── BOOK CARD ────────────────────────────────────────────────────────────────
function BookCard({ book, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.1)",
      }}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
        <img
          src={book.image_url || "https://via.placeholder.com/200x300"}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.style.background = "linear-gradient(135deg, #dbeafe, #f3e8ff)";
          }}
        />
        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)", opacity: hovered ? 1 : 0.2 }} />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ background: "#ffffff", color: "#1e40af", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
            {book.genre && book.genre !== "Not found in database" ? book.genre : "General"}
          </span>
        </div>
        <div className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
          style={{ background: "rgba(255,255,255,0.95)", color: "#059669" }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          {book.trustScore || 90}%
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{book.author || "Unknown Author"}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stars rating={book.rating || 4} />
            <span className="text-gray-500 text-xs">{book.rating || 4}</span>
          </div>
          <span className="text-gray-500 text-xs">{((book.reviews || 100) / 1000).toFixed(1)}k reviews</span>
        </div>
        <p className="text-gray-600 text-xs mt-3 line-clamp-2 leading-relaxed">{book.description}</p>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ books, onBookSelect, onAsk }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const genres = ["All", ...new Set(books.map((b) => b.genre || "General"))];

  const filtered = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.genre === filter;
    return matchSearch && matchFilter;
  });

  return (
    // KEY FIX: overflow-x-hidden on the page wrapper kills the bottom scrollbar
    <div className="min-h-screen pl-16 overflow-x-hidden" style={{ background: "#f9fafb", color: "#1f2937" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 px-8 py-5 flex items-center justify-between"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e5e7eb" }}>
        <div className="shrink-0">
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}>
            The Ethereal Librarian
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Your AI-powered reading companion</p>
        </div>
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md mx-8 min-w-0">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb" }} />
          </div>
        </div>
        <button className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
          + Upload Book
        </button>
      </header>

      <main className="px-8 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Books Uploaded", value: books.length, icon: "📚" },
            { label: "Insights Extracted", value: "1,240", icon: "✨" },
            { label: "Avg Trust Score", value: "94%", icon: "🛡️" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI CTA */}
        <div className="rounded-2xl p-6 mb-10 flex items-center justify-between relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#1e40af" }}>AI Intelligence</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Ask anything about your books</h2>
            <p className="text-gray-600 text-sm">Get summaries, genre analysis, and personalized recommendations</p>
          </div>
          <button onClick={onAsk}
            className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all hover:scale-105 shrink-0 ml-6"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            Ask AI
          </button>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
        </div>

        {/* Filter tabs — KEY FIX: min-w-0 + overflow-hidden wrapper */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Library</h2>
              <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-widest">Curated Artifacts</p>
            </div>
          </div>
          {/* This wrapper MUST be overflow-hidden so genre pills can't push page width */}
          <div className="overflow-hidden w-full">
            <GenreTabs genres={genres} filter={filter} setFilter={setFilter} />
          </div>
        </div>

        {/* Book Grid — always exactly 4 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1.25rem" }}>
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => onBookSelect(book)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-lg">No books found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Q&A PAGE ─────────────────────────────────────────────────────────────────
function QAPage({ books }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const callBackend = async (question) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/books/ask/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      return data.answer || "No answer found";
    } catch {
      return "Backend error. Try again.";
    }
  };

  const handleSend = async (q) => {
    const question = q || input.trim();
    if (!question) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);
    try {
      const answer = await callBackend(question);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="min-h-screen pl-16 flex flex-col overflow-x-hidden" style={{ background: "#f9fafb", color: "#1f2937" }}>
      <header className="sticky top-0 z-40 px-8 py-5 flex items-center justify-between"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e5e7eb" }}>
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}>
            Ask the Librarian
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">AI-powered insights from your library</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", color: "#1e40af" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {books.length} books in library
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6" style={{ paddingBottom: "120px" }}>
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 mt-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                <svg className="w-8 h-8" style={{ color: "#3b82f6" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                What would you like to explore?
              </h2>
              <p className="text-gray-600">Ask about summaries, themes, comparisons, or recommendations</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {QA_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-left p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
                  <svg className="w-4 h-4 mb-2" style={{ color: "#3b82f6" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-sm text-gray-700 font-medium">{s}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-3 shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user" ? "text-white rounded-br-sm" : "text-gray-800 rounded-bl-sm"
                }`}
                  style={msg.role === "user"
                    ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }
                    : { background: "#ffffff", border: "1px solid #e5e7eb" }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-3 shrink-0"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="px-5 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1"
                  style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#3b82f6", animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-16 right-0 p-5"
        style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid #e5e7eb" }}>
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <div className="flex-1 rounded-2xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500"
            style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
              rows={1} placeholder="Ask anything about your books..."
              className="w-full px-5 py-4 bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none resize-none"
              style={{ maxHeight: "120px" }} />
          </div>
          <button onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BOOK DETAIL PAGE ─────────────────────────────────────────────────────────
function BookDetailPage({ book, books, onBack }) {
  const [relatedBooks, setRelatedBooks] = useState([]);
  useEffect(() => {
  if (!book) return;

  fetch(`http://127.0.0.1:8000/api/books/${book.id}/recommend/`)
    .then(res => res.json())
    .then(data => setRelatedBooks(data))
    .catch(err => console.error(err));
}, [book]);
  if (!book) return (
    <div className="min-h-screen pl-16 flex items-center justify-center" style={{ background: "#f9fafb" }}>
      <div className="text-center">
        <p className="text-gray-500 mb-4">No book selected</p>
        <button onClick={onBack} className="text-blue-600 hover:text-blue-700 text-sm">← Back to Library</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pl-16 overflow-x-hidden" style={{ background: "#f9fafb", color: "#1f2937" }}>
      <header className="sticky top-0 z-40 px-8 py-5 flex items-center gap-4"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e5e7eb" }}>
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100 text-gray-600"
          style={{ border: "1px solid #e5e7eb" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-widest truncate">{book.genre || "General"} · {book.author || "Unknown Author"}</p>
          <h1 className="text-lg font-bold text-gray-900 truncate">{book.title}</h1>
        </div>
        <div className="ml-auto shrink-0">
          <a href={book.url} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 inline-block"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            Read Book ↗
          </a>
        </div>
      </header>

      <main className="px-8 py-8 max-w-5xl">
        <div className="flex gap-10 mb-12">
          <div className="shrink-0 w-48 rounded-2xl overflow-hidden shadow-lg"
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)", alignSelf: "flex-start" }}>
            <img
              src={book.image_url || "https://via.placeholder.com/200x300"}
              alt={book.title}
              className="w-full block"
              style={{ display: "block" }}
              onError={(e) => {
                e.target.style.display = "none";
                const p = e.target.parentElement;
                p.style.background = "linear-gradient(135deg, #dbeafe, #f3e8ff)";
                p.style.aspectRatio = "2/3";
              }} />
          </div>
          <div className="flex-1 pt-2 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(59, 130, 246, 0.15)", color: "#1e40af", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                {book.genre}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: "rgba(16, 185, 129, 0.1)", color: "#059669", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {book.trustScore}% Trust
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{book.title}</h2>
            <p className="text-xl mb-6" style={{ color: "#3b82f6" }}>{book.author || "Unknown Author"}</p>
            <div className="flex gap-8 mb-6 pb-6 flex-wrap" style={{ borderBottom: "1px solid #e5e7eb" }}>
              {[
                { label: "Published", value: book.published || "N/A" },
                { label: "Read Time", value: book.readTime || "N/A" },
                { label: "Pages", value: book.pages || "N/A" },
                { label: "Rating", value: `${book.rating || 4}/5` },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
                  <p className="font-semibold text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Stars rating={book.rating || 4} />
              <span className="text-gray-600 text-sm">{book.rating || 4} · {(book.reviews || 100).toLocaleString()} reviews</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">{book.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 rounded-2xl p-7 relative overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
              style={{ background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)" }} />
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-4 h-4" style={{ color: "#3b82f6" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1e40af" }}>AI Generated Synthesis</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">{book.summary ? book.summary : "No AI summary available"}</p>
          </div>
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">Reader Metrics</h4>
            <div className="space-y-5">
              {[
                { label: "Complexity", value: book.complexity || 50, color: "linear-gradient(90deg, #3b82f6, #8b5cf6)" },
                { label: "Data Density", value: book.dataDensity || 50, color: "linear-gradient(90deg, #a855f7, #ec4899)" },
                { label: "AI Trust Score", value: book.trustScore || 50, color: "linear-gradient(90deg, #10b981, #059669)", green: true },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-600">{m.label}</span>
                    <span className={`font-semibold ${m.green ? "text-green-600" : "text-gray-900"}`}>{m.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${m.value}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-7 mb-8" style={{ background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">Key Intelligence Themes</h4>
          <div className="flex flex-wrap gap-2">
            {(book.themes || ["General"]).map((theme) => (
              <span key={theme} className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 cursor-default"
                style={{ background: "rgba(59, 130, 246, 0.1)", color: "#1e40af", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Continue the Journey</p>
              <h3 className="text-xl font-bold text-gray-900">Related Books</h3>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {relatedBooks.map((rel) => (
              <div key={rel.id} className="flex gap-3 p-4 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
                style={{ border: "1px solid #e5e7eb", background: "#ffffff" }}>
                <div className="w-14 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                  <img src={rel.image_url} alt={rel.title} className="w-full aspect-[2/3] object-cover"
                    onError={(e) => { e.target.style.display = "none"; e.target.parentElement.style.background = "linear-gradient(135deg, #dbeafe, #f3e8ff)"; }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5 truncate">{rel.genre}</p>
                  <h5 className="font-bold text-gray-900 text-sm leading-tight mb-1 truncate">{rel.title}</h5>
                  <p className="text-gray-600 text-xs truncate">{rel.author || "Unknown Author"}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Stars rating={rel.rating || 4} />
                    <span className="text-xs text-gray-600">{rel.rating || 4}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setPage("detail");
  };

  const handleAsk = () => setPage("qa");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/books/")
      .then(res => res.json())
      .then(data => {
        console.log("API BOOKS:", data);
        setBooks(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    // ROOT: overflow-x-hidden is the final safety net
    <div className="flex overflow-x-hidden" style={{ background: "#f9fafb", minHeight: "100vh", maxWidth: "100vw" }}>
      <SideNav page={page} setPage={setPage} />
      <div className="flex-1 min-w-0">
        {page === "dashboard" && <DashboardPage books={books} onBookSelect={handleBookSelect} onAsk={handleAsk} />}
        {page === "qa" && <QAPage books={books} onBookSelect={handleBookSelect} />}
        {page === "detail" && <BookDetailPage book={selectedBook} books={books} onBack={() => setPage("dashboard")} />}
      </div>
    </div>
  );
}