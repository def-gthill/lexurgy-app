import Link from "next/link";
import styles from "./CheatSheet.module.css";

export interface CheatSheetExample {
  name: string;
  link: string;
  example: string;
  explanation: any;
}

export default function CheatSheet({
  examples,
}: {
  examples: CheatSheetExample[];
}) {
  return (
    <table className={styles.root}>
      <thead>
        <tr>
          <th className={styles.nameHeader}>Name</th>
          <th className={styles.exampleHeader}>Example</th>
          <th className={styles.explanationHeader}>Explanation</th>
        </tr>
      </thead>
      <tbody>
        {examples.map((example) => (
          <tr key={example.name}>
            <td>
              <Link href={`/sc/docs/${example.link}`}>{example.name}</Link>
            </td>
            <td>
              <pre>{example.example}</pre>
            </td>
            <td>{example.explanation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
