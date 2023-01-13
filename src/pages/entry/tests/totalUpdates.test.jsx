import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Options from "../Options";

test("update scoop subtotal when scoops changes", async () => {
    const user = userEvent.setup();
    render(<Options optionType={"scoops"} />);

    // subtotal start at $0.00
    const scoopSubtotal = screen.getByText("Scoops total: $", { exact: false });
    expect(scoopSubtotal).toHaveTextContent("$0.00");

    // update vanilla scoops to 1, and check subtotal
    const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(scoopSubtotal).toHaveTextContent("$2.00");

    // update chocolate scoops to 2 and check subtotal
    const chocolateScoops = await screen.getByRole("spinbutton", {
        name: "Chocolate",
    });
    await user.clear(chocolateScoops);
    await user.type(chocolateScoops, "2");
    expect(chocolateScoops).toHaveTextContent("$6.00");
});
