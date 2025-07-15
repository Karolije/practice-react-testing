import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreditCardForm from "./CreditCardForm";

test("renders input and issuer", () => {
  render(<CreditCardForm />);
  expect(screen.getByLabelText(/numer karty/i)).toBeInTheDocument();
  expect(screen.getByText(/producent/i)).toBeInTheDocument();
});

test("shows issuer as Visa", async () => {
  render(<CreditCardForm />);
  await userEvent.type(
    screen.getByLabelText(/numer karty/i),
    "4111111111111111"
  );
  expect(screen.getByText(/visa/i)).toBeInTheDocument();
});

test("shows error on invalid card number", async () => {
  render(<CreditCardForm />);
  await userEvent.type(
    screen.getByLabelText(/numer karty/i),
    "1234567890123456"
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(/niepoprawny/i);
});

test("does not show error for valid MasterCard", async () => {
  render(<CreditCardForm />);
  await userEvent.type(
    screen.getByLabelText(/numer karty/i),
    "5500000000000004"
  );
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByText(/MasterCard/i)).toBeInTheDocument();
});
