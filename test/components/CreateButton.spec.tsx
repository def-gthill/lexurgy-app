import CreateButton from "@/components/CreateButton";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

describe("a create button", () => {
  const onSave = jest.fn();

  let save: (value: string) => void;
  let cancel: () => void;

  function MockEditor({
    onSave,
    onCancel,
  }: {
    onSave: (value: string) => void;
    onCancel: () => void;
  }) {
    const [value, setValue] = useState("");
    save = onSave;
    cancel = onCancel;
    return (
      <div>
        <div>Content</div>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    );
  }

  beforeEach(() => {
    render(
      <CreateButton
        label="Mock"
        component={(onSave, onCancel) => (
          <MockEditor onSave={onSave} onCancel={onCancel} />
        )}
        onSave={onSave}
      />
    );
  });

  describe("initially", () => {
    it("displays its label", () => {
      expect(screen.getByText("Mock")).toBeInTheDocument();
    });

    it("doesn't display the content", () => {
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
  });

  describe("after clicking the button", () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByText("Mock"));
    });

    it("shows the content", () => {
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("doesn't display the label", () => {
      expect(screen.queryByText("Mock")).not.toBeInTheDocument();
    });

    describe("when onSave is called", () => {
      beforeEach(async () => {
        await userEvent.type(screen.getByRole("textbox"), "Foobar");
        act(() => save("Foobar"));
      });

      it("saves", () => {
        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith("Foobar");
      });

      it("shows the label again", () => {
        expect(screen.getByText("Mock")).toBeInTheDocument();
      });

      it("resets the content for the next create", async () => {
        await userEvent.click(screen.getByText("Mock"));
        expect(screen.getByRole("textbox")).toHaveValue("");
      });
    });

    describe("when onCancel is called", () => {
      beforeEach(async () => {
        await userEvent.type(screen.getByRole("textbox"), "Foobar");
        act(cancel);
      });

      it("doesn't save", () => {
        expect(onSave).not.toHaveBeenCalled();
      });

      it("shows the label again", () => {
        expect(screen.getByText("Mock")).toBeInTheDocument();
      });
    });
  });
});
