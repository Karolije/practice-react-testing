import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Auth from "./Auth";
import * as md5Provider from "./../providers/md5Provider";

test("logs in the user with correct data", async () => {
  const md5Spy = jest
    .spyOn(md5Provider, "getMd5")
    .mockResolvedValue("8ae75b43f70f20ba564200ef4ab63a33");
  render(<Auth />);
  await userEvent.type(screen.getByLabelText(/login/i), "jan@domena.pl");
  await userEvent.type(screen.getByLabelText(/password/i), "janeczek");
  await userEvent.click(screen.getByText(/send/i));

  const heading = await screen.findByRole("heading", {
    name: /Jesteś zalogowany jako: jan@domena.pl/i,
  });

  expect(heading).toBeInTheDocument();

  expect(md5Spy).toHaveBeenCalledWith("janeczek");

  md5Spy.mockRestore();
});

test("shows error message when login fails", async () => {
  const md5Spy = jest
    .spyOn(md5Provider, "getMd5")
    .mockResolvedValue("błędny_hash");

  render(<Auth />);
  await userEvent.type(
    screen.getByLabelText(/login/i),
    "nieistnieje@domena.pl"
  );
  await userEvent.type(screen.getByLabelText(/password/i), "zlehaslo");
  await userEvent.click(screen.getByText(/send/i));

  const heading = screen.queryByRole("heading", {
    name: /jesteś zalogowany jako/i,
  });
  expect(heading).not.toBeInTheDocument();

  md5Spy.mockRestore();
});
