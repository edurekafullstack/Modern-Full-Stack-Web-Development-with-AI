const FILTER_FIELDS = ["status", "priority", "project"];
const SORT_FIELDS = ["dueDate", "createdAt", "title"];
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function parsePositiveInt(value, name, fallback) {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw badRequest(`${name} must be a positive whole number`);
  }
  return number;
}

export function parseListQuery(query) {
  const filter = {};
  for (const field of FILTER_FIELDS) {
    if (query[field] !== undefined) filter[field] = query[field];
  }

  const sortParam = [].concat(query.sort ?? "dueDate").join(",");
  const sortFields = sortParam.split(",").map((field) => field.trim());
  for (const field of sortFields) {
    if (!SORT_FIELDS.includes(field.replace(/^-/, ""))) {
      const allowed = SORT_FIELDS.join(", ");
      throw badRequest(`Cannot sort by "${field}". Use: ${allowed}`);
    }
  }
  const sort = [...sortFields, "_id"].join(" ");

  const page = parsePositiveInt(query.page, "page", 1);
  const requested = parsePositiveInt(query.limit, "limit", DEFAULT_LIMIT);
  const limit = Math.min(requested, MAX_LIMIT);

  return { filter, sort, page, limit };
}
