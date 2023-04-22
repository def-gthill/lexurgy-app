import Construction from "@/models/Construction";
import styles from "@/styles/ConstructionView.module.css";

export default function ConstructionView({
  construction,
}: {
  construction: Construction;
}) {
  return (
    <div className="card">
      {construction.name && <div>{construction.name}</div>}
      <div className={styles.children}>
        {construction.children.map((childName) => (
          <div key={childName} className={styles.child}>
            {childName}
          </div>
        ))}
      </div>
    </div>
  );
}
