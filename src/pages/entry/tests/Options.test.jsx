import { render, screen } from "../../../test-utils/testing-library-utils";
import Options from "../Options";

test("displays image for each scoop from the server", async () => {
    render(<Options optionType="scoops" />);

    // find images
    const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
    expect(scoopImages).toHaveLength(2);

    // confirm alt text of images
    const altTexts = scoopImages.map((el) => el.getAttribute("alt"));
    expect(altTexts).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("displays image of each topping from the server", async () => {
    render(<Options optionType="toppings" />);

    const toppingsImages = await screen.findAllByRole("img", {
        name: /topping$/i,
    });
    expect(toppingsImages).toHaveLength(3);

    const altTexts = toppingsImages.map((el) => el.getAttribute("alt"));
    expect(altTexts).toEqual([
        "Cherries topping",
        "M&Ms topping",
        "Hot fudge topping",
    ]);
});
