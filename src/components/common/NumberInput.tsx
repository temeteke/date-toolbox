interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function NumberInput({
  value,
  onChange,
  label,
  min,
  max,
  step = 1,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div className="number-input">
      {label && <label>{label}</label>}
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
