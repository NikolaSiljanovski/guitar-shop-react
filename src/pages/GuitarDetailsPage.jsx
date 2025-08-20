import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./GuitarDetailsPage.css";
import translations from "../components/translations";

const guitars = [
  { id: "1", name: "The Essential Les Paul", image: "/lespaulnoback-removebg-preview.png" },
  { id: "4", name: "Active Precision Bass® PH V", image: "/activeprecisionnobackground.png" },
  { id: "6", name: "Professional II Stratocaster®", image: "/proffesional2-removebg-preview.png" },
  { id: "2", name: "J-45 Standard", image: "/j-45-removebg-preview.png" },
  { id: "5", name: "Redondo Special", image: "/redondo-removebg-preview.png" },
  { id: "3", name: "Hummingbird Standard", image: "/hummingbird-removebg-preview.png" },
];

const sharedSpec = {
  description: "This guitar is crafted for players seeking rich tone, premium build, and legendary style. Built to inspire and perform at any level.",
  details: [
    'Body Wood: "Mahogany"',
    'Neck Wood: "Mahogany"',
    'Fingerboard: "Rosewood"',
    'Pickups: "Humbuckers"',
    'Tuners: "Grover"',
    'Scale Length: "24.75 inches"',
    'Bridge: "Tune-o-Matic"',
  ],
};

const sharedArtists = [
  { name: "Jimi Hendrix", image: "/musicianhair.png" },
  { name: "David Gilmour", image: "/musicianbald.png" },
];

export default function GuitarDetailsPage() {
  const { guitarId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("spec");
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const flagMap = {
    en: "/united-kingdom.png",
    mk: "/republic-of-macedonia.png",
    sq: "/albania.png",
  };

  const t = translations[language];
  const guitar = guitars.find((g) => g.id === guitarId);
  const imageRotationClass = parseInt(guitarId) <= 3 ? "rotate-up" : "rotate-down";


  if (!guitar) {
    return (
      <section className="models-hero">
        <div className="models-hero__topbar">
          <div className="topbar-wrapper">
            <div className="models-hero__back" onClick={() => navigate("/")}>{t.back}</div>
            <div className="hero__logo">
              <img src="/logohometop.png" alt="VibeStrings logo" className="logo" />
              <span className="logo-text">VibeStrings</span>
            </div>
          </div>
        </div>
        <div className="models-hero__content">
          <div className="models-hero__text"><h1>{t.notFound}</h1></div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="models-hero">
        <div className="models-hero__topbar">
          <div className="topbar-wrapper">
            <div className="models-hero__back" onClick={() => navigate("/")}>{t.back}</div>
            <div className="hero__logo">
              <img src="/logohometop.png" alt="VibeStrings logo" className="logo" />
              <span className="logo-text">VibeStrings</span>
            </div>
          </div>
        </div>

        <div className="models-hero__content">
          <div className="models-hero__text">
            <h1 className="guitar-title-only">{guitar.name}</h1>
          </div>
          <div className="models-hero__right">
            <div className="orange-bg" />
            <img src={guitar.image} alt={guitar.name} className={`brand-logo-floating ${imageRotationClass}`} />
          </div>
        </div>
      </section>

      <section className="spec-section">
        <div className="spec-tabs">
          <div className={`spec-tab ${activeTab === "spec" ? "active" : "inactive"}`} onClick={() => setActiveTab("spec")}>
            {t.spec}
          </div>
          <div className={`spec-tab ${activeTab === "artists" ? "active" : "inactive"}`} onClick={() => setActiveTab("artists")}>
            {t.who}
          </div>
        </div>

        <div className="spec-content">
          {activeTab === "spec" ? (
            <>
              <p className="spec-description">{sharedSpec.description}</p>
              <ul className="spec-list">
                {sharedSpec.details.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <div className="artist-section">
              {sharedArtists.map((artist, index) => (
                <div className="artist-card" key={index}>
                  <img src={artist.image} alt={artist.name} className="artist-image" />
                  <div className="artist-name">{artist.name}</div>
                </div>
              ))}
            </div>
          )}
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
                src={flagMap[language]}
                alt={`${language} flag`}
                className="flag-icon"
              />
              <select id="language-select" value={language} onChange={handleLanguageChange}>
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
