import { set } from "@/array";
import Select from "@/components/Select";
import { rekey, update } from "@/map";
import { dropKeys } from "@/object";
import * as Label from "@radix-ui/react-label";
import { mapValues } from "lodash";
import { Fragment } from "react";

export interface Schema<T> {
  name: string;
  empty(): T;
  accepts(value: unknown): boolean;
  editor(
    value: T,
    onChange: (value: T) => void,
    options?: Options
  ): JSX.Element;
}

export interface Options {
  isRoot?: boolean;
  key?: string;
}

function fillDefaults(options: Options): Required<Options> {
  return { isRoot: true, key: "schema", ...options };
}

export class StringSchema implements Schema<string> {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  empty(): string {
    return "";
  }

  accepts(value: unknown): boolean {
    return typeof value === "string";
  }

  editor(
    value: string,
    onChange: (value: string) => void,
    options: Options = {}
  ): JSX.Element {
    const myOptions = fillDefaults(options);
    const key = myOptions.key;
    if (myOptions.isRoot) {
      return (
        <div key={key}>
          <Label.Root htmlFor={key}>{this.name}</Label.Root>
          <input
            type="text"
            id={key}
            style={{ maxWidth: 200 }}
            value={value as string}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      );
    } else {
      return (
        <input
          type="text"
          key={key}
          id={key}
          style={{ maxWidth: 200 }}
          value={value as string}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    }
  }
}

export function string(name: string): StringSchema {
  return new StringSchema(name);
}

export class ObjectSchema<T> implements Schema<T> {
  name: string;
  properties: { [Property in keyof T]: Schema<T[Property]> };
  options: { typeKeyed: boolean };

  constructor(
    name: string,
    properties: { [Property in keyof T]: Schema<T[Property]> },
    options: { typeKeyed: boolean } = { typeKeyed: false }
  ) {
    if (options.typeKeyed && Object.entries(properties).length !== 1) {
      throw new Error("A type-keyed object must have exactly one property");
    }

    this.name = name;
    this.properties = properties;
    this.options = options;
  }

  empty(): T {
    return mapValues(this.properties, (schema) => schema.empty()) as T;
  }

  accepts(value: unknown): boolean {
    if (value === null) {
      return false;
    }
    if (typeof value !== "object") {
      return false;
    }
    const keys = Object.keys(value);
    if (keys.length !== Object.keys(this.properties).length) {
      return false;
    }
    for (const [key, propertyValue] of Object.entries(value)) {
      if (!(key in this.properties)) {
        return false;
      }
      const propertySchema = this.properties[key as keyof T];
      if (!propertySchema.accepts(propertyValue)) {
        return false;
      }
    }
    return true;
  }

  editor(
    value: T,
    onChange: (value: T) => void,
    options: Options = {}
  ): JSX.Element {
    const myOptions = fillDefaults(options);
    const key = myOptions.key;

    const entries = Object.entries(this.properties);
    return (
      <div id={key} key={key}>
        {myOptions.isRoot && <h4>{this.name}</h4>}
        {this.options.typeKeyed ? (
          propertyEditor(
            entries[0] as [string & keyof T, Schema<T[string & keyof T]>]
          )
        ) : entries.length === 0 ? (
          <div />
        ) : (
          this.options.typeKeyed && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "max-content max-content",
              }}
            >
              {entries.map(
                labelledPropertyEditor as (
                  args: [string, unknown]
                ) => JSX.Element
              )}
            </div>
          )
        )}
      </div>
    );

    function labelledPropertyEditor<Property extends string & keyof T>([
      property,
      schema,
    ]: [Property, Schema<T[Property]>]): JSX.Element {
      const childKey = `${key}__${property}`;
      return (
        <Fragment key={childKey}>
          <Label.Root htmlFor={childKey}>{schema.name}</Label.Root>
          {propertyEditor([property, schema])}
        </Fragment>
      );
    }

    function propertyEditor<Property extends string & keyof T>([
      property,
      schema,
    ]: [Property, Schema<T[Property]>]): JSX.Element {
      const childKey = `${key}__${property}`;
      return schema.editor(
        value[property],
        (propertyValue) =>
          onChange({
            ...value,
            [property]: propertyValue,
          }),
        {
          isRoot: false,
          key: childKey,
        }
      );
    }
  }
}

export function object<T>(
  name: string,
  properties: { [Property in keyof T]: Schema<T[Property]> }
): ObjectSchema<T> {
  return new ObjectSchema(name, properties);
}

export function typeKeyedObject<T>(
  name: string,
  properties: { [Property in keyof T]: Schema<T[Property]> }
): ObjectSchema<T> {
  return new ObjectSchema(name, properties, { typeKeyed: true });
}

export class ArraySchema<T> implements Schema<T[]> {
  name: string;
  elements: Schema<T>;

  constructor(name: string, elements: Schema<T>) {
    this.name = name;
    this.elements = elements;
  }

  empty(): T[] {
    return [this.elements.empty()];
  }

  accepts(value: unknown): boolean {
    if (!Array.isArray(value)) {
      return false;
    }
    for (const element of value) {
      if (!this.elements.accepts(element)) {
        return false;
      }
    }
    return true;
  }

  editor(
    value: T[],
    onChange: (value: T[]) => void,
    options: Options = {}
  ): JSX.Element {
    const myOptions = fillDefaults(options);
    const key = myOptions.key;

    return (
      <div id={key} key={key}>
        {myOptions.isRoot && <h4>{this.name}</h4>}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {value.map((element, i) =>
            this.elements.editor(
              element,
              (element) => onChange(set(value, i, element)),
              {
                isRoot: false,
                key: `${key}__${i}`,
              }
            )
          )}
        </div>
        <div className="buttons">
          <button onClick={() => onChange([...value, this.elements.empty()])}>
            Add {this.elements.name}
          </button>
        </div>
      </div>
    );
  }
}

export function array<T>(name: string, elements: Schema<T>): ArraySchema<T> {
  return new ArraySchema(name, elements);
}

export class MapSchema<K, V> implements Schema<Map<K, V>> {
  name: string;
  keys: Schema<K>;
  values: Schema<V>;
  settings: MapSchemaSettings;

  constructor(
    name: string,
    keys: Schema<K>,
    values: Schema<V>,
    settings: MapSchemaSettings
  ) {
    this.name = name;
    this.keys = keys;
    this.values = values;
    this.settings = settings;
  }

  empty(): Map<K, V> {
    return new Map([[this.keys.empty(), this.values.empty()]]);
  }

  accepts(value: unknown): boolean {
    if (!(value instanceof Map)) {
      return false;
    }
    const map = value;
    for (const [key, value] of map.entries()) {
      if (!this.keys.accepts(key)) {
        return false;
      }
      if (!this.values.accepts(value)) {
        return false;
      }
    }
    return true;
  }

  editor(
    value: Map<K, V>,
    onChange: (value: Map<K, V>) => void,
    options: Options = {}
  ): JSX.Element {
    const map = value;
    const myOptions = fillDefaults(options);
    const domKey = myOptions.key;

    return (
      <div id={domKey} key={domKey}>
        {myOptions.isRoot && <h4>{this.name}</h4>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "max-content max-content",
          }}
        >
          <div>{this.keys.name}</div>
          <div>{this.values.name}</div>
          {[...value.entries()].map(([key, value], i) => {
            return (
              <Fragment key={i}>
                {this.keys.editor(
                  key,
                  (newKey) => onChange(rekey(map, key, newKey)),
                  { isRoot: false, key: `${domKey}__${i}__key` }
                )}
                {this.values.editor(
                  value,
                  (newValue) => onChange(update(map, [key, newValue])),
                  { isRoot: false, key: `${domKey}__${i}__value` }
                )}
              </Fragment>
            );
          })}
          <div className="buttons">
            <button
              onClick={() =>
                onChange(update(map, [this.keys.empty(), this.values.empty()]))
              }
            >
              Add {this.settings.entryName ?? this.values.name}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export function map<K, V>(
  name: string,
  keys: Schema<K>,
  values: Schema<V>,
  settings?: MapSchemaSettings
): MapSchema<K, V> {
  return new MapSchema(name, keys, values, settings ?? {});
}

export interface MapSchemaSettings {
  entryName?: string;
}

export class UnionSchema<T> implements Schema<T> {
  name: string;
  options: Schema<T>[];

  constructor(name: string, options: Schema<T>[]) {
    this.name = name;
    this.options = options;
  }

  empty(): T {
    return this.options[0].empty();
  }

  accepts(value: unknown): boolean {
    for (const option of this.options) {
      if (option.accepts(value)) {
        return true;
      }
    }
    return false;
  }

  editor(
    value: T,
    onChange: (value: T) => void,
    options: Options = {}
  ): JSX.Element {
    const myOptions = fillDefaults(options);
    const key = myOptions.key;
    const optionIndex = this.options.findIndex((option) =>
      option.accepts(value)
    );
    return (
      <div id={key} key={key}>
        <Select
          options={this.options.map((option, i) => ({
            name: option.name,
            value: i,
          }))}
          currentSelection={optionIndex}
          onChange={(value) => onChange(this.options[value].empty())}
        />
        {this.options[optionIndex].editor(value, onChange, {
          isRoot: false,
          key: `${key}__option`,
        })}
      </div>
    );
  }
}

export function union<T>(name: string, options: Schema<T>[]): UnionSchema<T> {
  return new UnionSchema(name, options);
}

export class TaggedUnionSchema<T extends { type: string }>
  implements Schema<T>
{
  name: string;
  options: Record<string, Schema<object>>;

  constructor(name: string, options: Record<string, Schema<any>>) {
    this.name = name;
    this.options = options;
  }

  empty(): T {
    const [tag, schema] = Object.entries(this.options)[0];
    return { type: tag, ...schema.empty() } as T;
  }

  accepts(value: unknown): boolean {
    if (value === null) {
      return false;
    }
    if (typeof value !== "object") {
      return false;
    }
    if (!("type" in value)) {
      return false;
    }
    if (typeof value.type !== "string") {
      return false;
    }
    const schema = this.options[value.type];
    if (!schema) {
      return false;
    }
    return schema.accepts(dropKeys(value, ["type"]));
  }

  editor(
    value: T,
    onChange: (value: T) => void,
    options: Options = {}
  ): JSX.Element {
    const myOptions = fillDefaults(options);
    const key = myOptions.key;
    const currentType = value.type;
    return (
      <div id={key} key={key}>
        <Select
          options={Object.entries(this.options).map(([type, schema]) => ({
            name: schema.name,
            value: type,
          }))}
          currentSelection={currentType}
          onChange={(value) =>
            onChange({ type: value, ...this.options[value].empty() } as T)
          }
        />
        {this.options[currentType].editor(
          value,
          (value) => onChange({ type: currentType, ...value } as T),
          { isRoot: false, key: `${key}__option` }
        )}
      </div>
    );
  }
}

export function taggedUnion<T extends { type: string }>(
  name: string,
  options: Record<string, Schema<object>>
): TaggedUnionSchema<T> {
  return new TaggedUnionSchema(name, options);
}

export class RecursiveSchema<T> implements Schema<T> {
  name: string;
  ref: Ref<T>;

  constructor(name: string, ref: Ref<T>) {
    this.name = name;
    this.ref = ref;
  }

  schema(): Schema<T> {
    if (!this.ref.schema) {
      throw new Error("Unbound ref");
    }
    return this.ref.schema;
  }

  empty(): T {
    return this.schema().empty();
  }

  accepts(value: unknown): boolean {
    return this.schema().accepts(value);
  }

  editor(
    value: T,
    onChange: (value: T) => void,
    options?: Options | undefined
  ): JSX.Element {
    return this.schema().editor(value, onChange, options);
  }
}

export function defineRef<T>(schema: Schema<T>, ref: Ref<T>): Schema<T> {
  ref.schema = schema;
  return schema;
}

export function callRef<T>(name: string, ref: Ref<T>): RecursiveSchema<T> {
  return new RecursiveSchema(name, ref);
}

export function ref<T>(): Ref<T> {
  return { schema: null };
}

export interface Ref<T> {
  schema: Schema<T> | null;
}
