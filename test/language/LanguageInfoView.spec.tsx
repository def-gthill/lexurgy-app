import LanguageInfoView from "@/language/LanguageInfoView";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("a language info view", () => {
  describe("that's editable", () => {
    const onUpdate = jest.fn();

    beforeEach(() => {
      render(
        <LanguageInfoView
          language={{ id: "abc", name: "Examplish" }}
          onUpdate={onUpdate}
        />
      );
    });

    it("lets the user rename the language", async () => {
      await userEvent.click(screen.getByText("Edit"));
      await userEvent.clear(screen.getByLabelText("Language Name"));
      await userEvent.type(screen.getByLabelText("Language Name"), "Renamese");
      await userEvent.click(screen.getByText("Save"));
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith({
        id: "abc",
        name: "Renamese",
      });
    });
  });

  describe("that's movable", () => {
    const onUpdate = jest.fn();

    beforeEach(() => {
      render(
        <LanguageInfoView
          language={{ id: "abc", name: "Examplish" }}
          worlds={[
            {
              id: "def",
              name: "Handwavia",
              description: "Home of Betamax Crinkledash",
            },
          ]}
          onUpdate={onUpdate}
        />
      );
    });

    it("lets the user move the language into one of the available worlds", async () => {
      await userEvent.click(screen.getByText("Move"));
      await userEvent.selectOptions(
        screen.getByLabelText("To World"),
        "Handwavia"
      );
      await userEvent.click(screen.getByText("Save"));

      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith({
        id: "abc",
        worldId: "def",
        name: "Examplish",
      });
    });
  });

  describe("that's in a redacted world", () => {
    const onUpdate = jest.fn();

    beforeEach(() => {
      render(
        <LanguageInfoView
          language={{ id: "abc", name: "Examplish", worldId: "redacted" }}
          worlds={[
            {
              id: "def",
              name: "Handwavia",
              description: "Home of Betamax Crinkledash",
            },
          ]}
          onUpdate={onUpdate}
        />
      );
    });

    it("doesn't let the user move it", () => {
      expect(screen.queryByText("Move")).not.toBeInTheDocument();
    });

    it("lets the user edit it without altering its world assignment", async () => {
      await userEvent.click(screen.getByText("Edit"));
      await userEvent.clear(screen.getByLabelText("Language Name"));
      await userEvent.type(screen.getByLabelText("Language Name"), "Renamese");
      await userEvent.click(screen.getByText("Save"));
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(onUpdate).toHaveBeenCalledWith({
        id: "abc",
        name: "Renamese",
      });
    });
  });
});
