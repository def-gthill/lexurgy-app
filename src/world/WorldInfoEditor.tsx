import * as Schema from "@/components/Schema";
import SchematicEditor from "@/components/SchematicEditor";
import World from "@/world/World";

export default function WorldInfoEditor({
  world,
  onChange,
}: {
  world: World;
  onChange: (newWorld: World) => void;
}) {
  return (
    <SchematicEditor
      schema={Schema.object("World", {
        name: Schema.string("Name"),
        description: Schema.string("Description"),
      })}
      value={world}
      onChange={onChange}
    />
  );
}
