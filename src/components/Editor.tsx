export default function Editor({
  children,
  onSave,
}: {
  children: JSX.Element[];
  onSave: () => void;
}) {
  return (
    <>
      {children}
      <div>
        <button onClick={onSave}>Save</button>
      </div>
    </>
  );
}
