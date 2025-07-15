import React, { useState } from "react";

function detectIssuer(number) {
  if (/^4/.test(number)) return "Visa";
  if (/^5[1-5]/.test(number)) return "MasterCard";
  if (/^3[47]/.test(number)) return "American Express";
  return "Nieznany";
}

function isValidCardNumber(number) {
  const digits = number.replace(/\D/g, "").split("").reverse().map(Number);
  const checksum = digits.reduce((sum, digit, idx) => {
    if (idx % 2 === 1) {
      const dbl = digit * 2;
      return sum + (dbl > 9 ? dbl - 9 : dbl);
    }
    return sum + digit;
  }, 0);
  return checksum % 10 === 0;
}

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [issuer, setIssuer] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\s+/g, "");
    setCardNumber(value);
    setIssuer(detectIssuer(value));
    setIsValid(value.length >= 13 && isValidCardNumber(value));
  };

  return (
    <form>
      <label>
        Numer karty:
        <input
          value={cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          aria-label="card number"
        />
      </label>
      <div>
        Producent: <strong>{issuer}</strong>
      </div>
      {!isValid && <p role="alert">Numer karty jest niepoprawny.</p>}
    </form>
  );
};

export default CreditCardForm;
