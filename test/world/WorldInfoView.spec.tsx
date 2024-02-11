import WorldInfoView from "@/world/WorldInfoView";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("a world info view", () => {
  describe("that's editable", () => {
    const onUpdate = jest.fn();

    beforeEach(() => {
      render(
        <WorldInfoView
          world={{
            id: "abc",
            name: "Handwavia",
            description: "Home of Betamax Crinkledash",
          }}
          onUpdate={onUpdate}
        />
      );
    });

    it("lets the user rename the world", async () => {
      await userEvent.click(screen.getByText("Edit"));
      await userEvent.clear(screen.getByLabelText("Name"));
      await userEvent.type(screen.getByLabelText("Name"), "Examplia");
      await userEvent.click(screen.getByText("Save"));
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith({
        id: "abc",
        name: "Examplia",
        description: "Home of Betamax Crinkledash",
      });
    });
  });

  describe("with the example switch enabled", () => {
    const onUpdate = jest.fn();

    beforeEach(() => {
      render(
        <WorldInfoView
          world={{
            id: "abc",
            name: "Handwavia",
            description: "Home of Betamax Crinkledash",
          }}
          onUpdate={onUpdate}
          exampleSwitchEnabled
        />
      );
    });

    it("lets the user make the world an example", async () => {
      await userEvent.click(screen.getByLabelText("Example"));
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith({
        id: "abc",
        name: "Handwavia",
        description: "Home of Betamax Crinkledash",
        isExample: true,
      });
    });
  });
});
