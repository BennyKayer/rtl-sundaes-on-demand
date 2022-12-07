import { render, fireEvent, screen, logRoles } from "@testing-library/react";
import SummaryForm from "../SummaryForm";

test("Test Summary form", async () => {
    render(<SummaryForm />);

    const confirmButton = screen.getByRole("button", { name: "Confirm order" });
    const checkbox = screen.getByRole("checkbox", {
        name: "I agree to Terms and Conditions",
    });

    // Initial
    expect(confirmButton).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    // Checkbox checked should unblock button
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(confirmButton).toBeEnabled();

    // Un-checking disables button
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(confirmButton).toBeDisabled();
});
