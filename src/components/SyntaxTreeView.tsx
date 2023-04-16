import SyntaxNode from "@/models/SyntaxNode";
import Word from "@/models/Word";
import styles from "@/styles/SyntaxTreeView.module.css";

export default function SyntaxTreeView({ root }: { root: SyntaxNode }) {
  return (
    <div className={styles.root}>
      <SyntaxNodeView node={root} level={1} />
    </div>
  );
}

function SyntaxNodeView({
  node,
  level,
  name,
}: {
  node: SyntaxNode;
  level: number;
  name?: string;
}) {
  return (
    <div className={`${styles.branch} ${styles[`branch${level}`]}`}>
      {name && <div className={styles.nodeType}>{name}</div>}
      {node.construction && (
        <div className={styles.nodeType}>{node.construction.name}</div>
      )}
      <div className={styles.branchContent}>
        {Object.entries(node.children).map(([childName, child]) =>
          "romanized" in child ? (
            <div key={childName} className={styles.leaf}>
              <div className={styles.nodeType}>{childName}</div>
              <div>{(child as Word).romanized}</div>
            </div>
          ) : (
            <SyntaxNodeView node={child} level={level + 1} name={childName} />
          )
        )}
      </div>
    </div>
  );
}
