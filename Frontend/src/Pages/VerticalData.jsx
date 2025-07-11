import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import ErrorPage from '../components/ErrorPage';
import { ThemeContext } from '../ThemeContext';
import '../Styles/RMWise.css';

const VerticalPage = () => {
    const { verticalName } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedQuarters, setExpandedQuarters] = useState({});
    const { theme } = useContext(ThemeContext);
    const BASE_URL = import.meta.env.VITE_API_URL;

    const activeQuarters = ['1', '2', '3', '4'];

    useEffect(() => {
        const fetchVerticalData = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/${verticalName}`);
                const result = res.data?.data || res.data;
                setData(Array.isArray(result) ? result : []);
            } catch (err) {
                console.error('❌ Error fetching vertical data:', err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVerticalData();
    }, [verticalName]);

    const toggleQuarter = (q) => {
        setExpandedQuarters((prev) => ({
            ...prev,
            [q]: !prev[q],
        }));
    };

    const totalRow = {
        totalTarget: data.reduce((sum, item) => sum + (item.totalTarget || 0), 0),
    };

    activeQuarters.forEach((q) => {
        totalRow[`Q${q} Target`] = data.reduce((sum, item) => sum + (item.quarterTargets?.[q] || 0), 0);
        if (expandedQuarters[q]) {
            totalRow[`Q${q} Enrolled`] = data.reduce((sum, item) => sum + (item.quarterAchievements?.[q]?.enrolled || 0), 0);
            totalRow[`Q${q} Trained`] = data.reduce((sum, item) => sum + (item.quarterAchievements?.[q]?.trained || 0), 0);
            totalRow[`Q${q} Placed`] = data.reduce((sum, item) => sum + (item.quarterAchievements?.[q]?.placed || 0), 0);
        }
    });

    if (loading) return <Loader />;
    if (!loading && (!Array.isArray(data) || data.length === 0)) {
        return <ErrorPage message={`No data available for "${verticalName.toUpperCase()}"`} />;
    }

    return (
        <div className="rmwise-container">
            <div className="rmwise-header">
                <h2 className="rmwise-title">{verticalName.toUpperCase()} Vertical Data</h2>
            </div>

            <div className="table-wrapper">
                <table className="rmwise-table">
                    <thead>
                        <tr>
                            <th>RM Name</th>
                            <th>Project</th>
                            <th>State</th>
                            <th>Total Target</th>
                            {activeQuarters.map((q) => (
                                <React.Fragment key={q}>
                                    <th onClick={() => toggleQuarter(q)} className="clickable">
                                        Q{q} Target
                                    </th>
                                    {expandedQuarters[q] && (
                                        <>
                                            <th>Q{q} Enrolled</th>
                                            <th>Q{q} Trained</th>
                                            <th>Q{q} Placed</th>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.rmName}</td>
                                <td>{item.projectName}</td>
                                <td>{item.state}</td>
                                <td>{item.totalTarget}</td>
                                {activeQuarters.map((q) => (
                                    <React.Fragment key={q}>
                                        <td className={`q${q}-cell clickable`} onClick={() => toggleQuarter(q)}>
                                            {item.quarterTargets?.[q] || 0}
                                        </td>
                                        {expandedQuarters[q] && (
                                            <>
                                                <td>{item.quarterAchievements?.[q]?.enrolled || 0}</td>
                                                <td>{item.quarterAchievements?.[q]?.trained || 0}</td>
                                                <td>{item.quarterAchievements?.[q]?.placed || 0}</td>
                                            </>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr className="total-row">
                            <td colSpan={3} style={{ fontWeight: 'bold' }}>Total</td>
                            <td>{totalRow.totalTarget}</td>
                            {activeQuarters.map((q) => (
                                <React.Fragment key={`total-q${q}`}>
                                    <td className={`q${q}-cell`}>{totalRow[`Q${q} Target`] || 0}</td>
                                    {expandedQuarters[q] && (
                                        <>
                                            <td>{totalRow[`Q${q} Enrolled`] || 0}</td>
                                            <td>{totalRow[`Q${q} Trained`] || 0}</td>
                                            <td>{totalRow[`Q${q} Placed`] || 0}</td>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default VerticalPage;


// import React, { useEffect, useState, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Loader from '../components/Loader';
// import ErrorPage from '../components/ErrorPage'; // ✅ required fallback
// import '../Styles/RMWise.css';
// import { ThemeContext } from '../ThemeContext';

// const VerticalPage = () => {
//     const { verticalName } = useParams();
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [expandedQuarters, setExpandedQuarters] = useState({});
//     const { theme } = useContext(ThemeContext);

//     const BASE_URL = import.meta.env.VITE_API_URL;

//     useEffect(() => {
//         const fetchVerticalData = async () => {
//             try {
//                 const res = await axios.get(`${BASE_URL}/api/${verticalName}`);
//                 const result = res.data?.data || res.data;
//                 console.log(result)

//                 setData(Array.isArray(result) ? result : []);
//             } catch (err) {
//                 console.error('❌ Error fetching vertical data:', err);
//                 setData([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchVerticalData();
//     }, [verticalName]);

//     const toggleQuarter = (q) => {
//         setExpandedQuarters((prev) => ({
//             ...prev,
//             [q]: !prev[q],
//         }));
//     };

//     const activeQuarters = ['1', '2', '3', '4'];

//     const totalRow = {
//         totalTarget: data.reduce((sum, item) => sum + (item.totalTarget || 0), 0),
//     };

//     activeQuarters.forEach((q) => {
//         totalRow[`Q${q} Target`] = data.reduce((sum, item) => sum + (item[`Q${q} Target`] || 0), 0);
//         if (expandedQuarters[q]) {
//             totalRow[`Q${q} Enrolled`] = data.reduce((sum, item) => sum + (item[`Q${q} Enrolled`] || 0), 0);
//             totalRow[`Q${q} Trained`] = data.reduce((sum, item) => sum + (item[`Q${q} Trained`] || 0), 0);
//             totalRow[`Q${q} Placed`] = data.reduce((sum, item) => sum + (item[`Q${q} Placed`] || 0), 0);
//         }
//     });

//     // 🔄 Loading
//     if (loading) return <Loader />;

//     // ❌ No Data
//     if (!loading && (!Array.isArray(data) || data.length === 0)) {
//         return <ErrorPage message={`No data available for "${verticalName.toUpperCase()}"`} />;
//     }

//     return (
//         <div className="rmwise-container">
//             <div className="rmwise-header">
//                 <h2 className="rmwise-title">{verticalName.toUpperCase()} Vertical Data</h2>
//             </div>

//             <div className="table-wrapper">
//                 <table className="rmwise-table">
//                     <thead>
//                         <tr>
//                             <th>RM Name</th>
//                             <th>Project</th>
//                             <th>State</th>
//                             <th>Total Target</th>
//                             {activeQuarters.map((q) => (
//                                 <React.Fragment key={q}>
//                                     <th onClick={() => toggleQuarter(q)} className="clickable">
//                                         Q{q} Target
//                                     </th>
//                                     {expandedQuarters[q] && (
//                                         <>
//                                             <th>Q{q} Enrolled</th>
//                                             <th>Q{q} Trained</th>
//                                             <th>Q{q} Placed</th>
//                                         </>
//                                     )}
//                                 </React.Fragment>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((item, idx) => (
//                             <tr key={idx}>
//                                 <td>{item.rmName}</td>
//                                 <td>{item.projectName}</td>
//                                 <td>{item.state}</td>
//                                 <td>{item.totalTarget}</td>
//                                 {activeQuarters.map((q) => (
//                                     <React.Fragment key={q}>
//                                         <td className={`q${q}-cell clickable`} onClick={() => toggleQuarter(q)}>
//                                             {item[`Q${q} Target`] || 0}
//                                         </td>
//                                         {expandedQuarters[q] && (
//                                             <>
//                                                 <td>{item[`Q${q} Enrolled`] || 0}</td>
//                                                 <td>{item[`Q${q} Trained`] || 0}</td>
//                                                 <td>{item[`Q${q} Placed`] || 0}</td>
//                                             </>
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>

//                     <tfoot>
//                         <tr className="total-row">
//                             <td colSpan={3} style={{ fontWeight: 'bold' }}>Total</td>
//                             <td>{totalRow.totalTarget}</td>
//                             {activeQuarters.map((q) => (
//                                 <React.Fragment key={`total-q${q}`}>
//                                     <td className={`q${q}-cell`}>{totalRow[`Q${q} Target`] || 0}</td>
//                                     {expandedQuarters[q] && (
//                                         <>
//                                             <td>{totalRow[`Q${q} Enrolled`] || 0}</td>
//                                             <td>{totalRow[`Q${q} Trained`] || 0}</td>
//                                             <td>{totalRow[`Q${q} Placed`] || 0}</td>
//                                         </>
//                                     )}
//                                 </React.Fragment>
//                             ))}
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default VerticalPage;


// import React, { useEffect, useState, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Loader from '../components/Loader';
// import '../Styles/RMWise.css';
// import { ThemeContext } from '../ThemeContext';

// const VerticalPage = () => {
//     const { verticalName } = useParams();
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [expandedQuarters, setExpandedQuarters] = useState({});
//     const { theme } = useContext(ThemeContext);

//     const BASE_URL = import.meta.env.VITE_API_URL;

//     useEffect(() => {
//         const fetchVerticalData = async () => {
//             try {
//                 const res = await axios.get(`${BASE_URL}/api/vertical/${verticalName}`);
//                 const result = res.data?.data || res.data;

//                 if (!Array.isArray(result) || result.length === 0) {
//                     setData([]); // ensures no crash
//                 } else {
//                     setData(result);
//                 }
//             } catch (err) {
//                 console.error('❌ Error fetching vertical data:', err);
//                 setData([]); // ensures no crash
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchVerticalData();
//     }, [verticalName]);


//     const toggleQuarter = (q) => {
//         setExpandedQuarters((prev) => ({
//             ...prev,
//             [q]: !prev[q],
//         }));
//     };

//     const activeQuarters = ['1', '2', '3', '4'];
//     const totalRow = {
//         totalTarget: data.reduce((sum, item) => sum + (item.totalTarget || 0), 0),
//     };

//     activeQuarters.forEach((q) => {
//         totalRow[`Q${q} Target`] = data.reduce((sum, item) => sum + (item[`Q${q} Target`] || 0), 0);
//         if (expandedQuarters[q]) {
//             totalRow[`Q${q} Enrolled`] = data.reduce((sum, item) => sum + (item[`Q${q} Enrolled`] || 0), 0);
//             totalRow[`Q${q} Trained`] = data.reduce((sum, item) => sum + (item[`Q${q} Trained`] || 0), 0);
//             totalRow[`Q${q} Placed`] = data.reduce((sum, item) => sum + (item[`Q${q} Placed`] || 0), 0);
//         }
//     });

//     if (loading) return <Loader />;
//     if (data === null || !Array.isArray(data) || data.length === 0) {
//         return <ErrorPage message={`No data available for "${verticalName.toUpperCase()}"`} />;
//     }

//     return (
//         <div className="rmwise-container">
//             <div className="rmwise-header">
//                 <h2 className="rmwise-title">{verticalName.toUpperCase()} Vertical Data</h2>
//             </div>

//             <div className="table-wrapper">
//                 <table className="rmwise-table">
//                     <thead>
//                         <tr>
//                             <th>RM Name</th>
//                             <th>Project</th>
//                             <th>State</th>
//                             <th>Total Target</th>
//                             {activeQuarters.map((q) => (
//                                 <React.Fragment key={q}>
//                                     <th onClick={() => toggleQuarter(q)} className="clickable">
//                                         Q{q} Target
//                                     </th>
//                                     {expandedQuarters[q] && (
//                                         <>
//                                             <th>Q{q} Enrolled</th>
//                                             <th>Q{q} Trained</th>
//                                             <th>Q{q} Placed</th>
//                                         </>
//                                     )}
//                                 </React.Fragment>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((item, idx) => (
//                             <tr key={idx}>
//                                 <td>{item.rmName}</td>
//                                 <td>{item.projectName}</td>
//                                 <td>{item.state}</td>
//                                 <td>{item.totalTarget}</td>
//                                 {activeQuarters.map((q) => (
//                                     <React.Fragment key={q}>
//                                         <td className={`q${q}-cell clickable`} onClick={() => toggleQuarter(q)}>
//                                             {item[`Q${q} Target`] || 0}
//                                         </td>
//                                         {expandedQuarters[q] && (
//                                             <>
//                                                 <td>{item[`Q${q} Enrolled`] || 0}</td>
//                                                 <td>{item[`Q${q} Trained`] || 0}</td>
//                                                 <td>{item[`Q${q} Placed`] || 0}</td>
//                                             </>
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>

//                     <tfoot>
//                         <tr className="total-row">
//                             <td colSpan={3} style={{ fontWeight: 'bold' }}>Total</td>
//                             <td>{totalRow.totalTarget}</td>
//                             {activeQuarters.map((q) => (
//                                 <React.Fragment key={`total-q${q}`}>
//                                     <td className={`q${q}-cell`}>{totalRow[`Q${q} Target`] || 0}</td>
//                                     {expandedQuarters[q] && (
//                                         <>
//                                             <td>{totalRow[`Q${q} Enrolled`] || 0}</td>
//                                             <td>{totalRow[`Q${q} Trained`] || 0}</td>
//                                             <td>{totalRow[`Q${q} Placed`] || 0}</td>
//                                         </>
//                                     )}
//                                 </React.Fragment>
//                             ))}
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default VerticalPage;
