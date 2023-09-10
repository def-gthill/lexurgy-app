import * as Schema from "@/components/Schema";

export default function SchematicEditor<T>({
  id,
  schema,
  value,
  onChange,
}: {
  id?: string;
  schema: Schema.Schema<T>;
  value: T;
  onChange: (value: T) => void;
}) {
  return schema.editor(value, onChange, id ? { key: id } : undefined);
}
