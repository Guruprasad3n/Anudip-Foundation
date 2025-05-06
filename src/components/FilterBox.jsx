import Select from 'react-select';

function FilterBox({ options, onChange }) {
  // react-select expects options in this format:
  const formattedOptions = options.map(code => ({ value: code, label: code }));

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    onChange(selectedValues);
  };

  return (
    <div style={{ width: '300px' }}>
      <Select
        isMulti
        options={formattedOptions}
        onChange={handleChange}
        placeholder="Select Center Codes..."
      />
    </div>
  );
}

export default FilterBox;
