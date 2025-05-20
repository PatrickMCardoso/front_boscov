type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
  };
  
  export default function Button({
    children,
    onClick,
    type = "button",
    className = "",
  }: ButtonProps) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition font-bold ${className}`}
      >
        {children}
      </button>
    );
  }