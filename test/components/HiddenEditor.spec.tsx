import HiddenEditor from "@/components/HiddenEditor";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("HiddenEditor", () => {
  function StringEditor({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  const onSave = jest.fn();

  function renderEditor(showButtonLabel: string, initialValue: string) {
    render(
      <HiddenEditor
        showButtonLabel={showButtonLabel}
        component={(value, onChange) => (
          <StringEditor value={value} onChange={onChange} />
        )}
        initialValue={initialValue}
        onSave={onSave}
      />
    );
  }

  it("lets the user create a resource", async () => {
    renderEditor("Create String", "");
    await userEvent.click(screen.getByText("Create String"));
    await userEvent.type(screen.getByRole("textbox"), "foobar");
    await userEvent.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("foobar");
  });

  it("lets the user edit an existing resource", async () => {
    renderEditor("Edit String", "foo");
    await userEvent.click(screen.getByText("Edit String"));
    await userEvent.type(screen.getByRole("textbox"), "bar");
    await userEvent.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("foobar");
  });

  it("lets the user cancel editing", async () => {
    renderEditor("Edit String", "foo");
    await userEvent.click(screen.getByText("Edit String"));
    await userEvent.type(screen.getByRole("textbox"), "bar");
    await userEvent.click(screen.getByText("Cancel"));
    expect(onSave).not.toHaveBeenCalled();
  });

  it("retains entered information if the user cancels", async () => {
    renderEditor("Edit String", "foo");
    await userEvent.click(screen.getByText("Edit String"));
    await userEvent.type(screen.getByRole("textbox"), "bar");
    await userEvent.click(screen.getByText("Cancel"));
    await userEvent.click(screen.getByText("Edit String"));
    expect(screen.getByRole("textbox")).toHaveValue("foobar");
  });

  it("clears entered information if the user saves", async () => {
    renderEditor("Create String", "");
    await userEvent.click(screen.getByText("Create String"));
    await userEvent.type(screen.getByRole("textbox"), "foobar");
    await userEvent.click(screen.getByText("Save"));
    await userEvent.click(screen.getByText("Create String"));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
});
