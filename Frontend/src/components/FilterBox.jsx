import Select from 'react-select';
import '../Styles/filterBox.css';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext'; // adjust path if needed

function FilterBox({ options, onChange }) {
  const { theme } = useContext(ThemeContext); // get theme from context

  const formattedOptions = options.map(code => ({ value: code, label: code }));

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onChange(selectedValues);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      color: theme === 'dark' ? '#e0e0e0' : '#000',
      borderColor: state.isFocused ? '#007acc' : '#ccc',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(0, 122, 204, 0.2)' : 'none',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
      color: theme === 'dark' ? '#e0e0e0' : '#000',
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused
        ? theme === 'dark' ? '#37474f' : '#e6f4ff'
        : theme === 'dark' ? '#2c2c2c' : '#fff',
      color: theme === 'dark' ? '#e0e0e0' : '#000',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme === 'dark' ? '#37474f' : '#e6f4ff',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: theme === 'dark' ? '#ffffff' : '#007acc',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: theme === 'dark' ? '#ffffff' : '#007acc',
      ':hover': {
        backgroundColor: theme === 'dark' ? '#455a64' : '#cce4f7',
        color: theme === 'dark' ? '#ffffff' : '#005999',
      },
    }),
  };

  return (
    <div className="filter-box-wrapper">
      <Select
        isMulti
        options={formattedOptions}
        onChange={handleChange}
        placeholder="Select Center Codes..."
        className="filter-select"
        classNamePrefix="react-select"
        styles={customStyles}
      />
    </div>
  );
}

export default FilterBox;



// import Select from 'react-select';
// import '../Styles/filterBox.css'

// function FilterBox({ options, onChange }) {
//   const formattedOptions = options.map(code => ({ value: code, label: code }));

//   const handleChange = (selectedOptions) => {
//     const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     onChange(selectedValues);
//   };

//   return (
//     <div className="filter-box-wrapper">
//       <Select
//         isMulti
//         options={formattedOptions}
//         onChange={handleChange}
//         placeholder="Select Center Codes..."
//         className="filter-select"
//         classNamePrefix="react-select"
//       />
//     </div>
//   );
// }

// export default FilterBox;