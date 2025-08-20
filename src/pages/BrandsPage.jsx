import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Grid, Truck, CreditCard } from "lucide-react";
import "./BrandsPage.css";

const GET_BRANDS = gql`
  query {
    findAllBrands {
      id
      name
      logo
    }
  }
`;

export default function BrandsPage() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_BRANDS);
  const [localBrands, setLocalBrands] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const flagMap = {
    en: "/united-kingdom.png",
    mk: "/republic-of-macedonia.png",
    sq: "/albania.png",
  };

  const translations = {
    en: {
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

  const t = translations[selectedLanguage];

  const handleBrandClick = (brandId) => {
    navigate(`/brands/${brandId}`);
  };

  useEffect(() => {
    if (error) {
      fetch("/brands.json")
        .then((res) => res.json())
        .then((brands) => setLocalBrands(brands))
        .catch((err) => console.error("Failed to load fallback brands:", err));
    }
  }, [error]);

  const brandsToShow =
    !loading && !error && data?.findAllBrands ? data.findAllBrands : localBrands;

  return (
    <>
      <section className="hero">
        <div className="hero__logo">
          <img src="/logohometop-removebg-preview.png" alt="VibeStrings logo" className="logo" />
          <span className="logo-text">VibeStrings</span>
        </div>

        <div className="hero__container">
          <div className="hero__left">
            <h1 className="hero__title">
              Browse top quality <em>Guitars</em> online
            </h1>
            <p className="hero__sub">
              Explore 50K+ latest collections of branded guitars online<br />
              with VibeStrings.
            </p>
          </div>

          <div className="hero__right">
            <img src="/homephoto.jpg" alt="Guitar" />
          </div>
        </div>
      </section>

      <section className="brands">
        <h2 className="brands__heading">
          Featuring the <span className="highlight">Best Brands</span>
        </h2>
        <p className="brands__subheading">
          Select your preferred brand and explore our exquisite collection.
        </p>

        {loading && <p className="brands__loading">Loading...</p>}
        {error && (
          <p className="brands__error">
            Couldn't load from API, showing local brands.
          </p>
        )}

        <div className="brands__grid">
          {brandsToShow.map((brand) => (
            <div
              key={brand.id}
              className="brand"
              onClick={() => handleBrandClick(brand.id)}
            >
              <img src={brand.logo} alt={brand.name} className="brand__logo" />
            </div>
          ))}
        </div>
      </section>

      <section className="why-try">
        <h2 className="why-try__title">
          Why try <span className="highlight">VibeStrings?</span>
        </h2>
        <div className="why-try__features">
          <div className="feature">
            <Grid className="feature__icon" size={48} />
            <h3 className="feature__title">SMOOTH BROWSING</h3>
            <p className="feature__desc">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
            </p>
          </div>
          <div className="feature">
            <Truck className="feature__icon" size={48} />
            <h3 className="feature__title">EASY DELIVERY</h3>
            <p className="feature__desc">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
            </p>
          </div>
          <div className="feature">
            <CreditCard className="feature__icon" size={48} />
            <h3 className="feature__title">SWIFT PAYMENTS</h3>
            <p className="feature__desc">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
            </p>
          </div>
        </div>
      </section>

      <section className="app-promo">
        <div className="app-promo__content">
          <h2 className="app-promo__text">
            Browse and buy your <span className="highlight">favorite guitars</span> with <br />
            VibeStrings.
          </h2>
          <div className="app-promo__badges">
            <img src="/googleplay.png" alt="Google Play" className="store-badge" />
            <img src="/appstore.png" alt="App Store" className="store-badge" />
          </div>
        </div>

        <div className="app-promo__images">
          <div className="app-promo__ellipse"></div>
          <img src="/dvegit home.png" alt="Phone 1" className="phone phone--left" />
          <img src="/ednagit home.png" alt="Phone 2" className="phone phone--right" />
        </div>
      </section>

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
              <img
                src={flagMap[selectedLanguage]}
                alt={`${selectedLanguage} flag`}
                className="flag-icon"
              />
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
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
