import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";

test("update scoop subtotal when scoops changes", async () => {
    const user = userEvent.setup();
    render(<Options optionType={"scoops"} />);

    // subtotal start at $0.00
    const scoopSubtotal = screen.getByText("Scoops total: $", {
        exact: false,
    });
    expect(scoopSubtotal).toHaveTextContent("$0.00");

    // update vanilla scoops to 1, and check subtotal
    const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(scoopSubtotal).toHaveTextContent("$2.00");

    // update chocolate scoops to 2 and check subtotal
    const chocolateInput = await screen.findByRole("spinbutton", {
        name: "Chocolate",
    });
    await userEvent.clear(chocolateInput);
    await userEvent.type(chocolateInput, "2");
    expect(scoopSubtotal).toHaveTextContent("$24.00");
});

test("update topping subtotal based on checked or unchecked toppings options", async () => {
    const user = userEvent.setup();
    render(<Options optionType="toppings" />);
    // Toppings are $1.50 each
    // initially no toppings are checked
    const toppingSubtotal = screen.getByText("Toppings total: $", {
        exact: false,
    });
    expect(toppingSubtotal).toHaveTextContent("$0.00");

    // Check cherries check if subtotal properly updated
    const cherriesCheckbox = await screen.findByRole("checkbox", {
        name: "Cherries",
    });
    await user.click(cherriesCheckbox);
    expect(toppingSubtotal).toHaveTextContent("$1.50");

    // Check mms check if subtotal properly updated
    const mmsCheckbox = await screen.findByRole("checkbox", {
        name: "M&Ms",
    });
    await user.click(mmsCheckbox);
    expect(toppingSubtotal).toHaveTextContent("$3.00");

    // Finally check the last one then check subtotal
    const hotFudgeCheckbox = await screen.findByRole("checkbox", {
        name: "Hot fudge",
    });
    await user.click(hotFudgeCheckbox);
    expect(toppingSubtotal).toHaveTextContent("$4.50");

    // Uncheck mms and check whether subtotal adjusted
    await user.click(mmsCheckbox);
    expect(toppingSubtotal).toHaveTextContent("$3.00");
});
