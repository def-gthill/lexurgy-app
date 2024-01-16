export default function Buttons({
  buttons,
}: {
  buttons: { label: string; onClick: () => void }[];
}) {
  return (
    <div className="buttons">
      {buttons.map(({ label, onClick }) => (
        <button key={label} onClick={onClick}>
          {label}
        </button>
      ))}
    </div>
  );
}
