import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Nav.css";

const Nav = () => {
  const [showServices, setShowServices] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav-wrapper ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* LOGO SECTION */}
        <Link to="/" className="logor">
          <div className="logo-icon">M</div>
          <h3>
            <span className="drum">Modelsmith</span>.AI
          </h3>
        </Link>
        
        {/* MOBILE TOGGLE */}
        <button
          className={`nav-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar" />
          <span className="bar" />
        </button>

        {/* NAVIGATION LINKS */}
        <div className={`linker ${menuOpen ? "open" : ""}`}>
          <Link 
            to="/" 
            className={location.pathname === "/" ? "active-link" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {/* DROPDOWN SERVICES */}
          <div
            className="dropdown-wrapper"
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <span className="dropdown-trigger">
              Services <span className="chevron">▾</span>
            </span>

            <AnimatePresence>
              {showServices && (
                <motion.div 
                  className="dropdown-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/automl" onClick={() => setMenuOpen(false)}>
                    <div className="drop-item">
                      <span className="drop-icon"></span>
                      <div>
                        <p className="drop-title">AutoML Engine</p>
                        <p className="drop-desc">Train models in one click</p>
                      </div>
                    </div>
                  </Link>

                  {/* ✅ PREDICT RE-ADDED */}
                  <Link to="/predict" onClick={() => setMenuOpen(false)}>
                    <div className="drop-item">
                      <span className="drop-icon"></span>
                      <div>
                        <p className="drop-title">Predict</p>
                        <p className="drop-desc">Run real-time inference</p>
                      </div>
                    </div>
                  </Link>

                  <Link to="/history" onClick={() => setMenuOpen(false)}>
                    <div className="drop-item">
                      <span className="drop-icon"></span>
                      <div>
                        <p className="drop-title">History</p>
                        <p className="drop-desc">View past experiments</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link 
            to="/about" 
            className={location.pathname === "/about" ? "active-link" : ""}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </div>

        {/* AUTH BUTTONS */}
        <div className={`losi ${menuOpen ? "open" : ""}`}>
          <button className="btn-login">Log in</button>
          <button className="btn-signup">Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;