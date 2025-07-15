// ComparisonPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Loader from '../components/Loader';
import { ThemeContext } from '../ThemeContext';
import '../Styles/ComparisonPage.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const ComparisonPage = () => {
  const { theme } = useContext(ThemeContext);
  const [vertical, setVertical] = useState(null);
  const [funder, setFunder] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verticalOptions, setVerticalOptions] = useState([]);
  const [funderOptions, setFunderOptions] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/filters`);
        setVerticalOptions(
          res.data.verticals.map((v) => ({ label: v, value: v }))
        );
        setFunderOptions(
          res.data.funders.map((f) => ({ label: f, value: f }))
        );
      } catch (err) {
        console.error('Failed to fetch filter data:', err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    if (vertical || funder) {
      fetchComparisonData();
    }
  }, [vertical, funder]);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/comparison`, {
        params: {
          vertical: vertical?.value || '',
          funder: funder?.value || ''
        }
      });
      setData(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching comparison data:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderBarChart = (title, targetKey, actualKey) => (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="funderProgram" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={targetKey} fill="#8884d8" name="Target" />
          <Bar dataKey={actualKey} fill="#82ca9d" name="Achieved" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className={`comparison-page ${theme}`}>
      <h2 className="comparison-title">📊 Fund-wise Comparison Dashboard</h2>

      <div className="comparison-filters">
        <Select
          className="filter-select"
          options={verticalOptions}
          value={vertical}
          onChange={setVertical}
          placeholder="Select Vertical (optional)"
          isClearable
        />
        <Select
          className="filter-select"
          options={funderOptions}
          value={funder}
          onChange={setFunder}
          placeholder="Select Funder (optional)"
          isClearable
        />
      </div>

      {loading ? (
        <Loader />
      ) : data.length > 0 ? (
        <div className="chart-grid">
          {renderBarChart("Enrollment Comparison", "totalEnrollmentTarget", "totalEnrolled")}
          {renderBarChart("Training Comparison", "totalTrainedTarget", "totalTrained")}
          {renderBarChart("Placement Comparison", "totalPlacementTarget", "totalPlaced")}
        </div>
      ) : (
        <p className="no-data-msg">Please select vertical or funder to view data.</p>
      )}
    </div>
  );
};

export default ComparisonPage;
 