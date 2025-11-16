import { formatDate } from '../../lib/utils';

interface DateInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  min?: Date;
  max?: Date;
  required?: boolean;
}

export default function DateInput({
  value,
  onChange,
  label,
  min,
  max,
  required = false,
}: DateInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    if (!dateString) {
      onChange(null);
      return;
    }

    const date = new Date(dateString);
    onChange(date);
  };

  const formattedValue = value ? formatDate(value, 'yyyy-MM-dd') : '';

  return (
    <div className="date-input">
      {label && <label>{label}</label>}
      <input
        type="date"
        value={formattedValue}
        onChange={handleChange}
        min={min ? formatDate(min, 'yyyy-MM-dd') : undefined}
        max={max ? formatDate(max, 'yyyy-MM-dd') : undefined}
        required={required}
      />
    </div>
  );
}
