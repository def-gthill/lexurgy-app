import Link from "next/link";
import styles from "./CheatSheet.module.css";

export interface CheatSheetExample {
  name: string;
  link: string;
  example: string;
  explanation: string;
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
          <th>Name</th>
          <th>Example</th>
          <th>Explanation</th>
        </tr>
      </thead>
      <tbody>
        {examples.map((example) => (
          <tr key={example.name}>
            <td>
              <Link href={`/sc/docs/tutorial/${example.link}`}>
                {example.name}
              </Link>
            </td>
            <td>
              <code>{example.example}</code>
            </td>
            <td>{example.explanation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
