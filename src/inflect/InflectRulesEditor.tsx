import SchematicEditor from "@/components/SchematicEditor";
import { InflectRules, inflectRulesSchema } from "@/inflect/InflectRules";

export function InflectRulesEditor({
  rules,
  saveRules,
}: {
  rules: InflectRules;
  saveRules: (rules: InflectRules) => void;
}) {
  return (
    <SchematicEditor
      id="rules"
      schema={inflectRulesSchema}
      value={rules}
      onChange={saveRules}
    />
  );
}
