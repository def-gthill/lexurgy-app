import { updateAssociationArray } from "@/array";

describe("The update function", () => {
  it("can add an entry to an empty map", () => {
    const result = updateAssociationArray([], ["foo", 42]);
    expect(result).to.deep.equal([["foo", 42]]);
  });

  it("can add an entry to a map with stuff in it", () => {
    const result = updateAssociationArray(
      [
        ["foo", 42],
        ["bar", 97],
      ],
      ["baz", 216]
    );
    expect(result).to.deep.equal([
      ["foo", 42],
      ["bar", 97],
      ["baz", 216],
    ]);
  });

  it("replaces an existing entry with a matching key", () => {
    const result = updateAssociationArray(
      [
        ["foo", 42],
        ["bar", 97],
      ],
      ["foo", 216]
    );
    expect(result).to.deep.equal([
      ["foo", 216],
      ["bar", 97],
    ]);
  });
});
