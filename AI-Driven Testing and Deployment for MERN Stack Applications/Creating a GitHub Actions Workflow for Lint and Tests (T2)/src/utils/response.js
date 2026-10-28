export function success(data, message = "Request successful") {
  return { status: "success", message, data };
}

export function failure(message, errors) {
  const body = { status: "error", message };
  if (errors) body.errors = errors;
  return body;
}
