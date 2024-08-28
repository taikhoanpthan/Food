import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./index.scss";

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.pageYOffset > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer" id="contact-us">
      <div className="footer-content">
        <div className="footer-section">
          <img src={assets.logo} alt="Logo" className="footer-logo" />
          <p className="footer-address">
            Địa chỉ: 274, Lê Quang Định, Phường 11, Bình Thạnh, TP.HCM
          </p>
          <p className="footer-delivery">
            Giao hàng: Giao hàng miễn phí dưới 2km
          </p>
          <div className="footer-socials">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>
        <div className="footer-section">
          <h2>COMPANY</h2>
          <ul className="footer-links">
            <li>Trang chủ</li>
            <li>Về chúng tôi</li>
            <li>Giao hàng</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>GET IN TOUCH</h2>
          <ul className="footer-contact">
            <li>+84706796875</li>
            <li>myphan.cv2003@gmail.com</li>
          </ul>
        </div>
      </div>
      {showScrollButton && (
        <button onClick={scrollToTop} className="scroll-button">
          Trở lại đầu trang
        </button>
      )}
      <p className="footer-copyright">
        Copyright 2024 © myphan2003.cv@gmail.com - ALL right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
