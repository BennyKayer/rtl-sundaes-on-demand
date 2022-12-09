import { render, screen } from "@testing-library/react";
import SummaryForm from "../SummaryForm";
import userEvent from "@testing-library/user-event";

test("Test Summary form", async () => {
    const user = userEvent.setup();
    render(<SummaryForm />);

    const confirmButton = screen.getByRole("button", { name: "Confirm order" });
    const checkbox = screen.getByRole("checkbox", {
        name: "I agree to Terms and Conditions",
    });

    // Initial
    expect(confirmButton).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    // Checkbox checked should unblock button
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(confirmButton).toBeEnabled();

    // Un-checking disables button
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(confirmButton).toBeDisabled();
});

test("Popover response to hover", async () => {
    const user = userEvent.setup();

    // Popover is hidden initially

    // Popover appears on mouseover of checkbox label

    // Popover disappears on mouseout
});
