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
    render(<SummaryForm />);

    // Popover is hidden initially
    const nullPop = screen.queryByText(
        /no ice cream will actually be delivered/i
    );
    expect(nullPop).not.toBeInTheDocument();

    // Popover appears on mouseover of checkbox label
    const termsAndConditions = screen.getByText(/terms and conditions/i);
    await userEvent.hover(termsAndConditions);
    const pop = screen.getByText(/no ice cream will actually be delivered/i);
    expect(pop).toBeInTheDocument();

    // Popover disappears on mouseout
    await userEvent.unhover(termsAndConditions);
    expect(pop).not.toBeInTheDocument();
});
