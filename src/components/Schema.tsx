import { set } from "@/array";
import * as Label from "@radix-ui/react-label";
import { mapValues } from "lodash";

export interface Schema<T> {
  name: string;
  empty(): T;
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

  editor(
    value: string,
    onChange: (value: string) => void,
    options: Options = {}
  ): JSX.Element {
    const myOptions = fillDefaults(options);
    const key = myOptions.key;
    return (
      <div key={key}>
        <Label.Root htmlFor={key}>{this.name}</Label.Root>
        <input
          type="text"
          id={key}
          value={value as string}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }
}

export class ObjectSchema<T> implements Schema<T> {
  name: string;
  properties: { [Property in keyof T]: Schema<T[Property]> };

  constructor(
    name: string,
    properties: { [Property in keyof T]: Schema<T[Property]> }
  ) {
    this.name = name;
    this.properties = properties;
  }

  empty(): T {
    return mapValues(this.properties, (schema) => schema.empty()) as T;
  }

  editor(
    value: T,
    onChange: (value: T) => void,
    options: Options = {}
  ): JSX.Element {
    const myOptions = fillDefaults(options);
    const key = myOptions.key;

    function propertyEditor<Property extends string & keyof T>([
      property,
      schema,
    ]: [Property, Schema<T[Property]>]): JSX.Element {
      return schema.editor(
        value[property],
        (propertyValue) =>
          onChange({
            ...value,
            [property]: propertyValue,
          }),
        {
          isRoot: false,
          key: `${key}__${property}`,
        }
      );
    }

    return (
      <div id={key} key={key}>
        <h4>{this.name}</h4>
        {Object.entries(this.properties).map(
          propertyEditor as (args: [string, unknown]) => JSX.Element
        )}
      </div>
    );
  }
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

  editor(
    value: T[],
    onChange: (value: T[]) => void,
    options: Options = {}
  ): JSX.Element {
    const myOptions = fillDefaults(options);
    const key = myOptions.key;

    return (
      <div id={key} key={key}>
        <h4>{this.name}</h4>
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
        <div className="buttons">
          <button onClick={() => onChange([...value, this.elements.empty()])}>
            Add {this.elements.name}
          </button>
        </div>
      </div>
    );
  }
}

export function string(name: string): StringSchema {
  return new StringSchema(name);
}

export function array<T>(name: string, elements: Schema<T>): ArraySchema<T> {
  return new ArraySchema(name, elements);
}

export function object<T>(
  name: string,
  properties: { [Property in keyof T]: Schema<T[Property]> }
): ObjectSchema<T> {
  return new ObjectSchema(name, properties);
}
