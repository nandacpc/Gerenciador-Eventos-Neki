export function Label({ label, tagInput }) {
  return (
    <label htmlFor={tagInput} className={tagInput}>
      {label}
    </label>
  );
}
