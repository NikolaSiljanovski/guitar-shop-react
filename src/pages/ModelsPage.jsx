// ModelsPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import { useQuery, gql } from "@apollo/client";
import "./ModelsPage.css";

const FIND_MODELS_BY_BRAND = gql`
  query FindModelsByBrand(
    $brandId: ID!
    $search: String
    $type: String
    $page: Int!
    $pageSize: Int!
  ) {
    findModelsByBrand(
      brandId: $brandId
      search: $search
      type: $type
      page: $page
      pageSize: $pageSize
    ) {
      items {
        id
        name
        price
        image
        type
      }
      total
      page
      pageSize
    }
  }
`;

export default function ModelsPage() {
  const { brandId } = useParams();
  const navigate = useNavigate();

  // --- Brand (локална мапа за hero делот, без API повик)
  const [brand, setBrand] = useState(null);

  // --- UI состојби за филтри/пребарување/пагинација
  const [filterType, setFilterType] = useState(null); // "Bass" | "Acoustic" | "Electric" | null
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // --- i18n за целата страница
  const [language, setLanguage] = useState("en");
  const translations = {
    en: {
      brandNotFound: "Brand not found.",
      backToHome: "← Back To Home",
      heroTitle1: "Play like a",
      heroTitle2: "Rock star",
      heroBodyA:
        "With a legacy dating back to the 1950s, {brand} blends expert craftsmanship with cutting-edge innovation to deliver guitars that inspire creativity and elevate your performance.",
      heroBodyB:
        "Trusted by top artists worldwide, {brand} guitars are built to play fast, sound bold, and stand out on any stage.",
      askChatGPT: "Ask ChatGPT",
      selectionTitleA: "Check out the",
      selectionTitleB: "Selection",
      filterTypePlaceholder: "Filter by type",
      searchByNamePlaceholder: "Search by name",
      showing: "SHOWING",
      resultsFrom: "RESULTS FROM",
      prev: "Prev",
      next: "Next",
      loading: "Loading…",
      error: "Couldn't load models from API. Showing local fallback.",
      pages: "PAGES",
      product: "PRODUCT",
      follow: "FOLLOW US",
      store: "Store",
      collections: "Collections",
      support: "Support",
      terms: "Terms",
      privacy: "Privacy Policy",
      copyright: "Copyright",
    },
    mk: {
      brandNotFound: "Бренд не е пронајден.",
      backToHome: "← Назад кон почетна",
      heroTitle1: "Свири како",
      heroTitle2: "Рок ѕвезда",
      heroBodyA:
        "Со наследство од 1950-тите, {brand} спојува мајсторство и иновација за гитари кои инспирираат креативност и ја креваат твојата изведба.",
      heroBodyB:
        "Доверени од врвни артисти ширум светот, гитарите на {brand} се создадени за брза свирка, моќен звук и доминација на сцена.",
      askChatGPT: "Прашај ChatGPT",
      selectionTitleA: "Погледни ја",
      selectionTitleB: "Колекцијата",
      filterTypePlaceholder: "Филтрирај по тип",
      searchByNamePlaceholder: "Барај по име",
      showing: "ПРИКАЖУВА",
      resultsFrom: "РЕЗУЛТАТИ ОД",
      prev: "Назад",
      next: "Напред",
      loading: "Се вчитува…",
      error: "API не е достапно. Прикажувам локален fallback.",
      pages: "СТРАНИЦИ",
      product: "ПРОДУКТ",
      follow: "СЛЕДЕТЕ НЕ",
      store: "Продавница",
      collections: "Колекции",
      support: "Поддршка",
      terms: "Услови",
      privacy: "Политика за приватност",
      copyright: "Авторски права",
    },
    sq: {
      brandNotFound: "Marka nuk u gjet.",
      backToHome: "← Kthehu në fillim",
      heroTitle1: "Luaj si",
      heroTitle2: "Yll Rock-u",
      heroBodyA:
        "Me trashëgimi që nga vitet 1950, {brand} kombinon mjeshtërinë me inovacion për të ofruar kitarra që frymëzojnë krijimtarinë dhe ngritin performancën tënde.",
      heroBodyB:
        "Të besuara nga artistë të njohur në mbarë botën, kitarra {brand} bëhen për të luajtur shpejt, për tingull të fuqishëm dhe për t'u dalluar në skenë.",
      askChatGPT: "Pyet ChatGPT",
      selectionTitleA: "Shiko",
      selectionTitleB: "Përzgjedhjen",
      filterTypePlaceholder: "Filtro sipas llojit",
      searchByNamePlaceholder: "Kërko sipas emrit",
      showing: "DUKE SHFAQUR",
      resultsFrom: "REZULTATE NGA",
      prev: "Prapa",
      next: "Para",
      loading: "Duke u ngarkuar…",
      error: "API nuk u ngarkua. Po shfaq fallback lokal.",
      pages: "FAQET",
      product: "PRODUKTI",
      follow: "NA NDIQNI",
      store: "Dyqan",
      collections: "Koleksione",
      support: "Mbështetje",
      terms: "Kushtet",
      privacy: "Politika e Privatësisë",
      copyright: "Të drejtat e autorit",
    },
  };
  const t = translations[language];

  // Флегови за футер
  const flagMap = useMemo(
    () => ({
      en: "/united-kingdom.png",
      mk: "/republic-of-macedonia.png",
      sq: "/albania.png",
    }),
    []
  );

  // Локален fallback сет за модели, ако API падне (користиме твоите слики/имиња)
  const localGuitars = useMemo(
    () => [
      { id: "1", name: "The Essential Les Paul", price: "$1,299.00", image: "/Lespaul.png", type: "Electric" },
      { id: "2", name: "J-45 Standard", price: "$1,699.00", image: "/j-45.png", type: "Acoustic" },
      { id: "3", name: "Hummingbird Standard", price: "$2,099.00", image: "/hummingbird.png", type: "Acoustic" },
      { id: "4", name: "Active Precision Bass\u00ae PH V", price: "$4,199.00", image: "/activeprecision.png", type: "Bass" },
      { id: "5", name: "Redondo Special", price: "$2,800.00", image: "/redondo.png", type: "Acoustic" },
      { id: "6", name: "Professional II Stratocaster\u00ae", price: "$3,199.00", image: "/proffesional2.png", type: "Electric" },
    ],
    []
  );

  // Brand hero (како твоето — само селекција по brandId)
  useEffect(() => {
    const brands = [
      { id: "1", name: "Ibanez", logo: "/ibanez.png", heroImage: "/ibanez-hero.png" },
      { id: "3", name: "Fender", logo: "/fender.png", heroImage: "/fender-hero.png" },
      { id: "2", name: "Martin & Co", logo: "/martin.png", heroImage: "/martin-hero.png" },
      { id: "4", name: "Gibson", logo: "/gibson.png", heroImage: "/gibson-hero.png" },
      { id: "5", name: "Taylor", logo: "/taylor-removebg-preview.png", heroImage: "/taylor-hero.png" },
      { id: "6", name: "Gretsch", logo: "/gretsch-removebg-preview.png", heroImage: "/gretsch-removebg-preview-hero.png" },
      { id: "7", name: "Redondo", logo: "/takamine-removebg-preview.png", heroImage: "/redondo-hero.png" },
      { id: "8", name: "Seagull", logo: "/seagull-removebg-preview.png", heroImage: "/seagull-hero.png" },
    ];
    const selectedBrand = brands.find((b) => b.id === brandId);
    setBrand(selectedBrand || null);
  }, [brandId]);

  // --- Apollo useQuery за модели
  const { loading, error, data, refetch } = useQuery(FIND_MODELS_BY_BRAND, {
    variables: {
      brandId,
      search: searchText || null,
      type: filterType || null,
      page,
      pageSize,
    },
    fetchPolicy: "cache-and-network",
  });

  // --- Derivations од одговорот
  const apiItems = data?.findModelsByBrand?.items ?? [];
  const apiTotal = data?.findModelsByBrand?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(apiTotal / pageSize));

  // --- Fallback (ако има грешка и нема items од API, филтрираме локално)
  const filteredLocal = useMemo(() => {
    const text = (searchText || "").toLowerCase();
    return localGuitars.filter((g) => {
      const matchName = !text || g.name.toLowerCase().includes(text);
      const matchType = !filterType || g.type === filterType;
      return matchName && matchType;
    });
  }, [localGuitars, searchText, filterType]);

  // --- Список кој ќе се прикажува
  const models = error && apiItems.length === 0 ? filteredLocal : apiItems;
  const totalForShow = error && apiItems.length === 0 ? filteredLocal.length : apiTotal || models.length;

  // --- Debounce за пребарување
  const [typingTimer, setTypingTimer] = useState(null);
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setPage(1);
    if (typingTimer) clearTimeout(typingTimer);
    const timer = setTimeout(() => {
      refetch({
        brandId,
        search: value || null,
        type: filterType || null,
        page: 1,
        pageSize,
      });
    }, 300);
    setTypingTimer(timer);
  };

  // --- Handler за избор на тип
  const selectType = useCallback(
    (val) => {
      setFilterType(val);
      setTypeDropdownOpen(false);
      setPage(1);
      refetch({
        brandId,
        search: searchText || null,
        type: val || null,
        page: 1,
        pageSize,
      });
    },
    [brandId, pageSize, refetch, searchText]
  );

  // --- Handler за пагинација
  const gotoPage = useCallback(
    (p) => {
      const clamped = Math.max(1, Math.min(totalPages, p));
      setPage(clamped);
      refetch({
        brandId,
        search: searchText || null,
        type: filterType || null,
        page: clamped,
        pageSize,
      });
    },
    [brandId, filterType, pageSize, refetch, searchText, totalPages]
  );

  // Помошна функција за текст со {brand}
  const withBrand = useCallback(
    (s) => (brand ? s.replace("{brand}", brand.name) : s.replace("{brand}", "")),
    [brand]
  );

  if (!brand) return <p className="models__error">{t.brandNotFound}</p>;

  return (
    <>
      <section className="models-hero">
        <div className="models-hero__topbar">
          <div className="topbar-wrapper">
            <div className="models-hero__back" onClick={() => navigate("/")}>
              {t.backToHome}
            </div>
            <div className="hero__logo">
              <img src="/logohometop.png" alt="VibeStrings logo" className="logo" />
              <span className="logo-text">VibeStrings</span>
            </div>
          </div>
        </div>

        <div className="models-hero__content">
          <div className="models-hero__text">
            <h1>
              {t.heroTitle1} <span className="highlight">{t.heroTitle2}</span>
            </h1>
            <p>{withBrand(t.heroBodyA)}</p>
            <p>{withBrand(t.heroBodyB)}</p>
            <p className="assistant-credit">{t.askChatGPT}</p>
          </div>
          <div className="models-hero__right">
            <div className="orange-bg" />
            <img src={brand.logo} alt={brand.name} className="brand-logo-floating" />
          </div>
        </div>
      </section>

      <section className="models-selection">
        <h2 className="models-selection__title">
          {t.selectionTitleA} <span className="highlight">{t.selectionTitleB}</span>
        </h2>

        <div className="models-selection__filters">
          {/* TYPE FILTER */}
          <div className="models-selection__input-wrapper dropdown-wrapper">
            <SlidersHorizontal size={18} className="models-selection__icon" />
            <input
              type="text"
              placeholder={t.filterTypePlaceholder}
              className="models-selection__input"
              value={filterType || t.filterTypePlaceholder}
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              readOnly
            />
            <div className="dropdown-arrow">▾</div>
            {typeDropdownOpen && (
              <div className="dropdown-menu">
                {["Bass", "Acoustic", "Electric"].map((type) => (
                  <div
                    key={type}
                    className={`dropdown-option ${filterType === type ? "selected" : ""}`}
                    onClick={() => selectType(type)}
                  >
                    {type}
                  </div>
                ))}
                {filterType && (
                  <div
                    className="dropdown-option clear"
                    onClick={() => selectType(null)}
                  >
                    ✕ Clear
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEARCH */}
          <div className="models-selection__input-wrapper">
            <Search size={18} className="models-selection__icon" />
            <input
              type="text"
              placeholder={t.searchByNamePlaceholder}
              className="models-selection__input"
              value={searchText}
              onChange={onSearchChange}
            />
          </div>
        </div>

        {/* Loading/Error */}
        {loading && <p className="brands__loading">{t.loading}</p>}
        {error && <p className="brands__error">{t.error}</p>}

        {/* GRID */}
        <div className="models-selection__grid">
          {models.map((guitar, index) => (
            <div
              key={guitar.id}
              className="guitar-card"
              onClick={() => navigate(`/guitar/${guitar.id}`, { state: guitar })}
            >
              <img
                src={guitar.image || "/placeholder.png"}
                alt={guitar.name}
                className={`guitar-image ${index % 2 === 0 ? "rotate-left" : "rotate-right"}`}
              />
              <div className="guitar-name">{guitar.name}</div>
              <div className="guitar-price">{guitar.price}</div>
            </div>
          ))}
        </div>

        {/* FOOTER BAR со бројки и пагинација */}
        <div className="models-selection__footer">
          <p className="models-selection__count">
            {t.showing} <span>{models.length}</span> {t.resultsFrom} <span>{totalForShow}</span>
          </p>

          <div className="pagination">
            <button className="pagination__btn" onClick={() => gotoPage(page - 1)} disabled={page <= 1}>
              &lt;
            </button>

            {renderPageButtons({ current: page, totalPages, onJump: gotoPage })}

            <button className="pagination__btn" onClick={() => gotoPage(page + 1)} disabled={page >= totalPages}>
              &gt;
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER со i18n и јазичен свичер */}
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__left">
            <div className="footer__logo">
              <img src="/logohometop.png" alt="VibeStrings logo" />
              <span className="logo-text">VibeStrings</span>
            </div>
            <div className="footer__info">
              <p><img src="/mail.png" alt="Email icon" className="icon" /> Enquiry@VibeStrings.com</p>
              <p><img src="/location.png" alt="Location icon" className="icon" /> San Francisco</p>
            </div>
          </div>

          <div className="footer__columns">
            <div className="footer__column">
              <h4>{t.pages}</h4>
              <ul>
                <li><a href="#">{t.store}</a></li>
                <li><a href="#">{t.collections}</a></li>
                <li><a href="#">{t.support}</a></li>
              </ul>
            </div>
            <div className="footer__column">
              <h4>{t.product}</h4>
              <ul>
                <li><a href="#">{t.terms}</a></li>
                <li><a href="#">{t.privacy}</a></li>
                <li><a href="#">{t.copyright}</a></li>
              </ul>
            </div>
          </div>

          <div className="footer__socials">
            <h4>{t.follow}</h4>
            <div className="social-icons">
              <img src="/facebook.png" alt="Facebook" />
              <img src="/twitter.png" alt="Twitter" />
              <img src="/instagram.png" alt="Instagram" />
            </div>
            <div className="language-switcher">
              <img src={flagMap[language]} alt={`${language} flag`} className="flag-icon" />
              <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="mk">Македонски</option>
                <option value="sq">Shqip</option>
              </select>
            </div>
          </div>
        </div>
        <p className="footer__copy">© 2022 Copyright VibeStrings</p>
      </footer>
    </>
  );
}

/**
 * Помошна функција за изрендерирани копчиња за пагинација
 * - компактно: 1 … (current-1) current (current+1) … last
 * - активна страна има class "active"
 */
function renderPageButtons({ current, totalPages, onJump }) {
  const btn = (p, { active = false, disabled = false, label } = {}) => (
    <button
      key={`p-${p}-${label || ""}`}
      className={`pagination__btn ${active ? "active" : ""}`}
      disabled={disabled}
      onClick={() => !disabled && onJump(p)}
    >
      {label || p}
    </button>
  );

  const dots = (key) => (
    <span className="pagination__dots" key={key}>...</span>
  );

  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, i) =>
      btn(i + 1, { active: i + 1 === current })
    );
  }

  const elements = [];
  elements.push(btn(1, { active: current === 1 }));
  if (current > 3) elements.push(dots("ld"));
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let p = start; p <= end; p++) {
    elements.push(btn(p, { active: p === current }));
  }
  if (current < totalPages - 2) elements.push(dots("rd"));
  elements.push(btn(totalPages, { active: current === totalPages }));

  return elements;
}
