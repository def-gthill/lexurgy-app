import Lexeme from "@/models/Lexeme";
import styles from "@/styles/LexiconView.module.css";

export default function LexiconView({ lexicon }: { lexicon: Lexeme[] }) {
  return (
    <ul>
      {lexicon.map((lexeme) => (
        <LexiconEntryView key={lexeme.id} entry={lexeme} />
      ))}
    </ul>
  );
}

function LexiconEntryView({ entry }: { entry: Lexeme }) {
  return (
    <li className="card">
      <div>
        <b>{entry.romanized}</b> - <i>{entry.pos}</i>
      </div>
      <ol>
        {entry.definitions.map((definition, i) => (
          <li key={i} className={styles.definition}>
            {definition}
          </li>
        ))}
      </ol>
    </li>
  );
}
