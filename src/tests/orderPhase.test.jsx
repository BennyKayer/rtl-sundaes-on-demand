import { render, screen } from "@testing-library/react";
import { logRoles } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import App from "../App";

test.only("order phases for happy path", async () => {
    const { unmount } = render(<App />);
    // screen.debug();
    // logRoles(container);
    const user = userEvent.setup();

    // add ice cream scoops and toppings
    const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");

    const mmsCheckbox = await screen.findByRole("checkbox", {
        name: "M&Ms",
    });
    await user.click(mmsCheckbox);

    // find and click order button
    const orderButton = screen.getByRole("button", {
        name: "Order Sundae!",
    });
    await user.click(orderButton);

    // check summary information based on order
    const scoopsConfirmation = screen.getByRole("heading", {
        name: /scoops:/i,
    });
    expect(scoopsConfirmation).toHaveTextContent("$2.00");

    const toppingsConfirmation = screen.getByRole("heading", {
        name: /toppings/i,
    });
    expect(toppingsConfirmation).toHaveTextContent("$1.50");
    // Confirm order is initially disabled
    const confirmButton = screen.getByRole("button", {
        name: /confirm order/i,
    });
    expect(confirmButton).toBeDisabled();

    // accept terms and conditions and click button to confirm order
    const termsAndConditionsCheckbox = screen.getByRole("checkbox", {
        name: /terms and conditions/i,
    });
    await user.click(termsAndConditionsCheckbox);
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);

    // confirm order number on confirmation page
    const orderNumber = await screen.findByText(/your order number is/i);
    screen.debug();
    expect(orderNumber).toBeInTheDocument();

    // click new order button on confirmation page
    const newOrderButton = screen.getByRole("button", {
        name: /create new order/i,
    });
    await user.click(newOrderButton);

    // check that scoops and topping subtotals have been reset
    const scoopsSubtotal = screen.getByText(/scoops total: /i);
    expect(scoopsSubtotal).toHaveTextContent("$0.00");
    const toppingSubtotal = screen.getByText(/toppings total: /i);
    expect(toppingSubtotal).toHaveTextContent("$0.00");
    unmount();
});
