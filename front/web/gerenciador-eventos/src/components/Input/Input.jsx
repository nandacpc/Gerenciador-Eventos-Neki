import styles from "./input.module.css";
export function Input({ type, placeholder, value, onChange, tagInput }) {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
