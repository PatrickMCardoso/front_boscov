type InputProps = {
    id: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
  };
  
  export default function Input({
    id,
    type = "text",
    value,
    onChange,
    placeholder = "",
    label,
    required = false,
  }: InputProps) {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
          required={required}
        />
      </div>
    );
  }