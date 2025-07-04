import Select from 'react-select';
import '../Styles/filterBox.css'

function FilterBox({ options, onChange }) {
  const formattedOptions = options.map(code => ({ value: code, label: code }));

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onChange(selectedValues);
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
      />
    </div>
  );
}

export default FilterBox;