import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft,
    FiArrowRight,
    FiBookOpen,
    FiSave,
    FiAward,
    FiTrendingUp,
    FiCpu,
    FiBarChart
} from 'react-icons/fi';

import '../Styles/CollapsibleSidebar.css';
import { ThemeContext } from '../ThemeContext';

const CollapsibleSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext)

    useEffect(() => {
        let timeout;
        if (isOpen) {
            timeout = setTimeout(() => setIsOpen(false), 10000);
        }
        return () => clearTimeout(timeout);
    }, [isOpen]);

    return (
        <div
            className={`sidebar-container ${theme}`}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <button
                className="toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setShowTooltip(true)}
            >
                {isOpen ? <FiArrowLeft /> : <FiArrowRight />}
                {!isOpen && showTooltip && (
                    <span className="tooltip">Program Wise Data</span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="sidebar-options"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <div className="sidebar-title">Program-wise Data</div>
                        <button onClick={() => navigate('/vertical/diya')}>
                            <FiBookOpen style={{ marginRight: '8px' }} /> DIYA
                        </button>
                        <button onClick={() => navigate('/vertical/save')}>
                            <FiSave style={{ marginRight: '8px' }} /> SAVE
                        </button>
                        <button onClick={() => navigate('/vertical/best')}>
                            <FiAward style={{ marginRight: '8px' }} /> BEST
                        </button>
                        <button onClick={() => navigate('/vertical/ace')}>
                            <FiTrendingUp style={{ marginRight: '8px' }} /> ACE
                        </button>
                        <button onClick={() => navigate('/vertical/deeptech')}>
                            <FiCpu style={{ marginRight: '8px' }} /> Deep Tech
                        </button>
                        <div className="sidebar-title">Compare Chart</div>
                        <button onClick={() => navigate('/comparison')}>
                            <FiBarChart style={{ marginRight: '8px' }} /> Compare FY
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleSidebar;