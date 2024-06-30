import { toNiceName } from "@/sc/ruleName";

describe("the toNiceName function", () => {
  it("replaces hyphens with spaces and uppercases each word", () => {
    const result = toNiceName("some-rule-name");

    expect(result).toBe("Some Rule Name");
  });

  it("converts the reserved name '<deromanizer>' to 'Deromanizer'", () => {
    const result = toNiceName("<deromanizer>");

    expect(result).toBe("Deromanizer");
  });

  it("converts an intermediate romanizer name to 'Romanizer' plus the name", () => {
    const result = toNiceName("<romanizer>-some-name");

    expect(result).toBe("Romanizer Some Name");
  });

  it("converts any syllable rule name to 'Syllables'", () => {
    const result = toNiceName("<syllables>/<initial>/1");

    expect(result).toBe("Syllables");
  });

  it("converts a cleanup rule name to 'Cleanup' plus the name", () => {
    const result = toNiceName("<cleanup>/<initial>/some-name");

    expect(result).toBe("Some Name (Cleanup)");
  });
});
