import { render, screen } from "@testing-library/react";
import Options from "../Options";

test("displays image for each scoop from the server", () => {
    render(<Options optionType="scoops" />);

    // find images
    const scoopImages = screen.getAllByRole("img", { name: /scoop$/i });
    expect(scoopImages).toHaveLength(2);

    // confirm alt text of images
    const altTexts = scoopImages.map((el) => el.getAttribute("alt"));
    expect(altTexts).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});
