import { range } from "@/array";
import { FlatStructure, flattenStructure } from "./FlatSyntaxNode";

describe("flattenStructure", () => {
  it("flattens a node with no children into an empty structure", () => {
    const flatStructure = flattenStructure({
      children: [],
    });
    const expected: FlatStructure = {
      nodes: [{ id: 0 }],
      nodeLimbs: [],
      wordLimbs: [],
    };
    expect(flatStructure).to.deep.equal(expected);
  });

  it("preserves the root node's properties", () => {
    const flatStructure = flattenStructure({
      nodeTypeId: "foobarbaz",
      construction: {
        name: "Foo",
        children: ["bar", "baz"],
      },
      children: [],
    });
    const expected: FlatStructure = {
      nodes: [
        {
          id: 0,
          nodeTypeId: "foobarbaz",
          construction: {
            name: "Foo",
            children: ["bar", "baz"],
          },
        },
      ],
      nodeLimbs: [],
      wordLimbs: [],
    };
    expect(flatStructure).to.deep.equal(expected);
  });

  it("creates a limb for each child that's a Word", () => {
    const flatStructure = flattenStructure({
      children: [
        ["Foo", { romanized: "foo" }],
        ["Bar", { romanized: "bar" }],
      ],
    });
    const expected: FlatStructure = {
      nodes: [{ id: 0 }],
      nodeLimbs: [],
      wordLimbs: [
        { parent: 0, childName: "Foo", child: { romanized: "foo" } },
        { parent: 0, childName: "Bar", child: { romanized: "bar" } },
      ],
    };
    expect(flatStructure).to.deep.equal(expected);
  });

  it("creates a limb for each child that's a SyntaxNode", () => {
    const flatStructure = flattenStructure({
      children: [
        ["Foo", { children: [] }],
        ["Bar", { children: [] }],
      ],
    });
    const expected: FlatStructure = {
      nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
      nodeLimbs: [
        { parent: 0, childName: "Foo", child: 1 },
        { parent: 0, childName: "Bar", child: 2 },
      ],
      wordLimbs: [],
    };
    expect(flatStructure).to.deep.equal(expected);
  });

  it("can flatten a two-level structure", () => {
    const flatStructure = flattenStructure({
      children: [
        [
          "Foo",
          {
            children: [
              ["Foo", { romanized: "a" }],
              ["Bar", { romanized: "b" }],
            ],
          },
        ],
        [
          "Bar",
          {
            children: [
              ["Foo", { romanized: "c" }],
              ["Bar", { romanized: "d" }],
            ],
          },
        ],
      ],
    });
    const expected: FlatStructure = {
      nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
      nodeLimbs: [
        { parent: 0, childName: "Foo", child: 1 },
        { parent: 0, childName: "Bar", child: 2 },
      ],
      wordLimbs: [
        { parent: 1, childName: "Foo", child: { romanized: "a" } },
        { parent: 1, childName: "Bar", child: { romanized: "b" } },
        { parent: 2, childName: "Foo", child: { romanized: "c" } },
        { parent: 2, childName: "Bar", child: { romanized: "d" } },
      ],
    };
    expect(flatStructure).to.deep.equal(expected);
  });

  it("can flatten a deeply nested structure", () => {
    const flatStructure = flattenStructure({
      children: [
        [
          "Foo",
          {
            children: [
              ["Foo", { children: [] }],
              ["Bar", { children: [] }],
            ],
          },
        ],
        [
          "Bar",
          {
            children: [
              ["Foo", { children: [] }],
              ["Bar", { children: [] }],
            ],
          },
        ],
      ],
    });
    const expected: FlatStructure = {
      nodes: range(7).map((i) => ({ id: i })),
      nodeLimbs: [
        { parent: 0, childName: "Foo", child: 1 },
        { parent: 0, childName: "Bar", child: 4 },
        { parent: 1, childName: "Foo", child: 2 },
        { parent: 1, childName: "Bar", child: 3 },
        { parent: 4, childName: "Foo", child: 5 },
        { parent: 4, childName: "Bar", child: 6 },
      ],
      wordLimbs: [],
    };
    expect(flatStructure).to.deep.equal(expected);
  });
});
