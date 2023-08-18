import { validateUserLexeme } from "@/lexicon/Lexeme";

describe("The lexeme validation function", () => {
  it("accepts a valid lexeme", () => {
    const input = {
      romanized: "sha",
      pos: "noun",
      definitions: ["cat"],
    };
    const result = validateUserLexeme(input);
    expect(result).to.deep.equal(input);
  });

  it("rejects a lexeme with a missing property", () => {
    const input = {
      romanized: "sha",
      definitions: ["cat"],
    };
    const result = validateUserLexeme(input);
    expect(result).to.be.a("string");
  });

  it("rejects a lexeme with a property of the wrong type", () => {
    const input = {
      romanized: "sha",
      pos: "noun",
      definitions: "cat",
    };
    const result = validateUserLexeme(input);
    expect(result).to.be.a("string");
  });

  it("rejects a lexeme with an extraneous property", () => {
    const input = {
      romanized: "sha",
      pos: "noun",
      definitions: ["cat"],
      foo: "bar",
    };
    const result = validateUserLexeme(input);
    expect(result).to.be.a("string");
  });
});
