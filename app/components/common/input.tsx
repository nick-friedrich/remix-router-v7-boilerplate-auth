export default function Input({
  label,
  placeholder,
  type,
  name,
}: {
  label: string;
  placeholder: string;
  type: string;
  name: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm text-base-content opacity-50">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        className="input input-bordered"
      />
    </div>
  );
}
