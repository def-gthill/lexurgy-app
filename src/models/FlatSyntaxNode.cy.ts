import { range } from "@/array";
import { flattenStructure } from "./FlatSyntaxNode";

describe("flattenStructure", () => {
  it("flattens a node with no children into an empty structure", () => {
    const flatStructure = flattenStructure({
      children: [],
    });
    expect(flatStructure).to.deep.equal({
      nodes: [{ id: 0 }],
      limbs: [],
    });
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
    expect(flatStructure).to.deep.equal({
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
      limbs: [],
    });
  });

  it("creates a limb for each child that's a Word", () => {
    const flatStructure = flattenStructure({
      children: [
        ["Foo", { romanized: "foo" }],
        ["Bar", { romanized: "bar" }],
      ],
    });
    expect(flatStructure).to.deep.equal({
      nodes: [{ id: 0 }],
      limbs: [
        { parent: 0, childName: "Foo", child: { romanized: "foo" } },
        { parent: 0, childName: "Bar", child: { romanized: "bar" } },
      ],
    });
  });

  it("creates a limb for each child that's a SyntaxNode", () => {
    const flatStructure = flattenStructure({
      children: [
        ["Foo", { children: [] }],
        ["Bar", { children: [] }],
      ],
    });
    expect(flatStructure).to.deep.equal({
      nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
      limbs: [
        { parent: 0, childName: "Foo", child: 1 },
        { parent: 0, childName: "Bar", child: 2 },
      ],
    });
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
    expect(flatStructure).to.deep.equal({
      nodes: [{ id: 0 }, { id: 1 }, { id: 2 }],
      limbs: [
        { parent: 0, childName: "Foo", child: 1 },
        { parent: 0, childName: "Bar", child: 2 },
        { parent: 1, childName: "Foo", child: { romanized: "a" } },
        { parent: 1, childName: "Bar", child: { romanized: "b" } },
        { parent: 2, childName: "Foo", child: { romanized: "c" } },
        { parent: 2, childName: "Bar", child: { romanized: "d" } },
      ],
    });
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
    expect(flatStructure).to.deep.equal({
      nodes: range(7).map((i) => ({ id: i })),
      limbs: [
        { parent: 0, childName: "Foo", child: 1 },
        { parent: 0, childName: "Bar", child: 4 },
        { parent: 1, childName: "Foo", child: 2 },
        { parent: 1, childName: "Bar", child: 3 },
        { parent: 4, childName: "Foo", child: 5 },
        { parent: 4, childName: "Bar", child: 6 },
      ],
    });
  });
});
