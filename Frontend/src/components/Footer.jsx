// components/Footer.js
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import "../Styles/Footer.css";
import Logo from "../Assets/Anudip-transparent.png"
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <img src={Logo} alt="Anudip Logo" className="logo" />
                <div className="social-icons">
                    <Link to={"#"}> <FaFacebookF /></Link>
                    <Link to={"#"}><FaInstagram /></Link>
                    <Link to={"#"}><FaXTwitter /></Link>
                    <Link to={"https://www.linkedin.com/company/anudip-foundation-for-social-welfare/posts/?feedView=all"} target="_blank"><FaLinkedinIn /></Link>
                    <Link to={"#"}><FaYoutube /></Link>
                </div>
            </div>
            <hr />
            <div className="footer-bottom">
                <p>© Copyright 2025. Anudip Foundation for Social Welfare</p>
                <div>
                    <a href="#">Privacy Policy</a> | <a href="#">Terms and Conditions</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
