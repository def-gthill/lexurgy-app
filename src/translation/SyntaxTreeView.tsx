import SyntaxNode, { childrenInOrder } from "@/translation/SyntaxNode";
import styles from "@/translation/SyntaxTreeView.module.css";
import Word from "@/translation/Word";

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
        {childrenInOrder(node).map(([childName, child]) =>
          "romanized" in child ? (
            <div key={childName} className={styles.leaf}>
              <div className={styles.nodeType}>{childName}</div>
              <div>{(child as Word).romanized}</div>
            </div>
          ) : (
            <SyntaxNodeView
              key={childName}
              node={child}
              level={level + 1}
              name={childName}
            />
          )
        )}
      </div>
    </div>
  );
}
