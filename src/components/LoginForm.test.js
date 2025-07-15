import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";
import userEvent from "@testing-library/user-event";

test("renders login input", () => {
  render(<LoginForm tryAuth={() => {}} />);
  const loginInput = screen.getByLabelText(/login/i);
  expect(loginInput).toBeInTheDocument();
});
test("shows error when login is too short", async () => {
  render(<LoginForm tryAuth={() => {}} />);
  const loginInput = screen.getByLabelText(/login/i);

  await userEvent.type(loginInput, "abc");
  const error = await screen.findByText(/too short/i);
  expect(error).toBeInTheDocument();
});

test("shows error message when tryAuth fails", async () => {
  const mockTryAuth = jest.fn(() => Promise.reject());

  render(<LoginForm tryAuth={mockTryAuth} />);
  const loginInput = screen.getByLabelText(/login/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const button = screen.getByText(/send/i);

  await userEvent.type(loginInput, "correctLogin");
  await userEvent.type(passwordInput, "correctPassword");
  await userEvent.click(button);

  const heading = await screen.findByRole("heading", {
    name: /incorrect data/i,
  });
  expect(heading).toBeInTheDocument();
});
