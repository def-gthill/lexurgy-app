import ScRunner from "@/sc/ScRunner";
import { render, screen } from "@testing-library/react";

describe("an SC runner", () => {
  it("has a sound change panel", () => {
    render(
      <ScRunner
        baseUrl={null}
        evolution={{ soundChanges: "", testWords: [] }}
      ></ScRunner>
    );
    expect(screen.getByText("Sound Changes")).toBeInTheDocument();
  });
});
