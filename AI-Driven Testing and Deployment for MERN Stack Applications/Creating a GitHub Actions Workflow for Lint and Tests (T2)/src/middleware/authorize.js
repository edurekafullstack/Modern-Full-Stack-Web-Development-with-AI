function forbidden() {
  const error = new Error("You do not have permission to perform this action");
  error.statusCode = 403;
  return error;
}

export function authorize(...roles) {
  return function authorizeRole(req, res, next) {
    if (!roles.includes(req.user?.role)) throw forbidden();
    next();
  };
}
