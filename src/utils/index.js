import React from "react";
import { Message } from "semantic-ui-react";

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const showErrorMsg = (errors, field) => {
  let msg = "";
  const { [field]: fieldValue } = errors;
  if (fieldValue && fieldValue.type === "required")
    msg = fieldValue.message || `${capitalize(field)} is required`;
  if (fieldValue && fieldValue.type === "minLength")
    msg = fieldValue.message || "Min 6 characters required";
  if (fieldValue && fieldValue.type === "validate")
    msg = fieldValue.message || "Validation failed";
  if (fieldValue && fieldValue.type === "pattern")
    msg = fieldValue.message || "Pattern mismatched";

  return (
    msg.length > 0 && (
      <Message color="red" floating>
        {msg}
      </Message>
    )
  );
};

export { showErrorMsg };
