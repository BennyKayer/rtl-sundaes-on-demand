import { render, screen, waitFor } from "@testing-library/react";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";

// test.only will run only this single test ignoring the rest
// test.skip will do the opposite
test("handles error for scoops and toppings routes", async () => {
    server.resetHandlers(
        rest.get("http://localhost:3030/scoops", (req, res, ctx) =>
            res(ctx.status(500))
        ),
        rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
            res(ctx.status(500))
        )
    );

    render(<OrderEntry />);

    // 2 alerts for both request, race condition may happen
    // const alerts = await screen.findAllByRole("alert");
    // https://testing-library.com/docs/dom-testing-library/api-async/#waitfor

    await waitFor(async () => {
        const alerts = await screen.findAllByRole("alert");
        expect(alerts).toHaveLength(2);
    });
});
