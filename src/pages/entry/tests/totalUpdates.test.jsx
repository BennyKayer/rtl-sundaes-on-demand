import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

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

describe("grand total", () => {
    test("grand total starts at $0.00", async () => {
        const { unmount } = render(<OrderEntry />);
        const grandTotal = screen.getByRole("heading", {
            name: /grand total: \$/i,
        });
        expect(grandTotal).toHaveTextContent("$0.00");
        unmount();
    });
    test("updates properly if scoop is added first", async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);

        const vanillaInput = await screen.findByRole("spinbutton", {
            name: "Vanilla",
        });
        await user.clear(vanillaInput);
        await user.type(vanillaInput, "2");
        const grandTotal = screen.getByRole("heading", {
            name: /grand total: \$/i,
        });
        expect(grandTotal).toHaveTextContent("$4.00");

        const cherriesCheckbox = await screen.findByRole("checkbox", {
            name: "Cherries",
        });
        await user.click(cherriesCheckbox);
        expect(grandTotal).toHaveTextContent("$5.50");
    });
    test("updates properly if topping is added first", async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);
        const grandTotal = screen.getByRole("heading", {
            name: /grand total: \$/i,
        });

        const mmsCheckbox = await screen.findByRole("checkbox", {
            name: "M&Ms",
        });
        const hotFudgeCheckbox = await screen.findByRole("checkbox", {
            name: "Hot fudge",
        });

        await user.click(mmsCheckbox);
        await user.click(hotFudgeCheckbox);
        expect(grandTotal).toHaveTextContent("$3.00");

        const chocolateInput = await screen.findByRole("spinbutton", {
            name: "Chocolate",
        });
        await user.clear(chocolateInput);
        await user.type(chocolateInput, "2");
        expect(grandTotal).toHaveTextContent("$7.00");
    });
    test("updates properly if topping is item is removed", async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);

        const grandTotal = screen.getByRole("heading", {
            name: /grand total: \$/i,
        });
        const vanillaInput = await screen.findByRole("spinbutton", {
            name: "Vanilla",
        });
        await user.clear(vanillaInput);
        await user.type(vanillaInput, "2");
        expect(grandTotal).toHaveTextContent("$4.00");

        await user.clear(vanillaInput);
        expect(grandTotal).toHaveTextContent("$0.00");
    });
});
