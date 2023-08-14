import { set } from "@/array";
import Construction from "@/syntax/Construction";
import Fields, { Field } from "../components/Fields";

export default function ConstructionEditor({
  construction,
  onChange,
}: {
  construction: Construction;
  onChange: (construction: Construction) => void;
}) {
  return (
    <div>
      <Fields>
        <Field
          id="name"
          name="Construction Name"
          value={construction.name}
          onChange={(value) => onChange({ ...construction, name: value })}
        />
        <>
          {construction.children.map((child, i) => (
            <Field
              key={i + 1}
              id={`slot${i + 1}`}
              name={`Slot ${i + 1}`}
              value={child}
              onChange={(value) =>
                onChange({
                  ...construction,
                  children: set(construction.children, i, value),
                })
              }
            />
          ))}
        </>
        <>
          {construction.children.at(-1) && (
            <div className="buttons">
              <button
                onClick={() =>
                  onChange({
                    ...construction,
                    children: [...construction.children, ""],
                  })
                }
              >
                Add Slot
              </button>
            </div>
          )}
        </>
      </Fields>
    </div>
  );
}
