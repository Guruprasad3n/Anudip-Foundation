import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../Styles/CollapsibleSidebar.css';

const CollapsibleSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let timeout;
        if (isOpen) {
            timeout = setTimeout(() => setIsOpen(false), 10000);
        }
        return () => clearTimeout(timeout);
    }, [isOpen]);

    return (
        <div
            className="sidebar-container"
            onMouseLeave={() => setShowTooltip(false)}
        >
            <button
                className="toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setShowTooltip(true)}
            >
                {isOpen ? '<' : '>'}
                {!isOpen && showTooltip && (
                    <span className="tooltip">Program Wise Data
                    </span>
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
                        <button onClick={() => navigate('/vertical/diya')}>DIYA</button>
                        <button onClick={() => navigate('/vertical/save')}>SAVE</button>
                        <button onClick={() => navigate('/vertical/best')}>BEST</button>
                        <button onClick={() => navigate('/vertical/ace')}>ACE</button>
                        <button onClick={() => navigate('/vertical/deeptech')}>Deep Tech</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleSidebar;