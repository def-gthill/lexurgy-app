import Select from "@/components/Select";
import { render } from "@testing-library/react";

describe("a select control", () => {
  describe("with no null option", () => {
    describe("on first render", () => {
      const onChange = jest.fn();

      beforeEach(() => {
        render(
          <Select options={["Red", "Green", "Blue"]} onChange={onChange} />
        );
      });

      it("automatically selects the first option", () => {
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith("Red");
      });
    });
  });
});
