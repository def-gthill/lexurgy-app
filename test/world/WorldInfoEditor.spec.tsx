import Editor from "@/components/Editor";
import { emptyWorld } from "@/world/World";
import WorldInfoEditor from "@/world/WorldInfoEditor";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("a world info editor", () => {
  describe("when creating a new world", () => {
    const onSave = jest.fn();

    beforeEach(() => {
      render(
        <Editor
          component={(value, onChange) => (
            <WorldInfoEditor world={value} onChange={onChange} />
          )}
          initialValue={emptyWorld()}
          onSave={onSave}
        />
      );
    });

    describe("after entering a world name", () => {
      beforeEach(async () => {
        await userEvent.type(screen.getByLabelText("Name"), "Handwavia");
      });

      it("saves the world when the save button is clicked", async () => {
        await userEvent.click(screen.getByText("Save"));
        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith({
          name: "Handwavia",
          description: "",
        });
      });
    });

    describe("after entering a world name and description", () => {
      beforeEach(async () => {
        await userEvent.type(screen.getByLabelText("Name"), "Handwavia");
        await userEvent.type(
          await screen.findByLabelText("Description"),
          "Home of Betamax Crinkledash"
        );
      });

      it("saves the world when the save button is clicked", async () => {
        await userEvent.click(screen.getByText("Save"));
        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith({
          name: "Handwavia",
          description: "Home of Betamax Crinkledash",
        });
      });
    });
  });
});
