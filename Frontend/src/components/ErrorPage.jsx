import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import '../Styles/ErrorPage.css';
import AnudipLogo from '../Assets/Anudip-Logo.png';
import { ThemeContext } from '../ThemeContext';

const ErrorPage = ({ message = "Sorry, the page you’re looking for doesn't exist." }) => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    return (
        <div className={`error-page ${theme}`}>
            <div className="error-content">
                <img src={AnudipLogo} alt="Anudip Logo" className="error-logo" />
                <FiAlertTriangle className="error-icon" />
                <h1 className="error-title">404 - Not Found</h1>
                <p className="error-message">{message}</p>
                <button className="error-btn" onClick={() => navigate('/')}>Go to Home</button>
            </div>
        </div>
    );
};

export default ErrorPage;
