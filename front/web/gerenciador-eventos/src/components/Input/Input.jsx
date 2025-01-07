export function Input({ type, placeholder, value, onChange, tagInput }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={tagInput}
    />
  );
}
