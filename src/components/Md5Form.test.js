import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Md5Form from "./Md5Form";

test("entered text appears in .data-text", async () => {
  const { container } = render(<Md5Form getMd5={() => {}} />);
  const input = screen.getByRole("textbox");

  await userEvent.type(input, "abc");

  const span = container.querySelector(".data-text");
  expect(span).toHaveTextContent("abc");
});

test("shows md5 after submitting the form", async () => {
  const fakeMd5 = "900150983cd24fb0d6963f7d28e17f72";
  const getMd5Mock = jest.fn(() => Promise.resolve(fakeMd5));

  render(<Md5Form getMd5={getMd5Mock} />);

  const input = screen.getByRole("textbox");
  const button = screen.getByRole("button", { name: /send/i });

  await userEvent.type(input, "abc");
  await userEvent.click(button);

  const md5Element = await screen.findByText(fakeMd5);
  expect(md5Element).toBeInTheDocument();

  expect(getMd5Mock).toHaveBeenCalledWith("abc");
});

test("clears md5 result after changing the input again", async () => {
  const getMd5Mock = jest.fn(() => Promise.resolve("qwerty123"));
  const { container } = render(<Md5Form getMd5={getMd5Mock} />);

  const input = screen.getByRole("textbox");
  const button = screen.getByRole("button", { name: /send/i });

  await userEvent.type(input, "abc");
  await userEvent.click(button);

  const result = await screen.findByText("qwerty123");
  expect(result).toBeInTheDocument();

  await userEvent.type(input, "x");

  const md5Span = container.querySelector(".data-md5");
  expect(md5Span).toHaveTextContent("");
});
