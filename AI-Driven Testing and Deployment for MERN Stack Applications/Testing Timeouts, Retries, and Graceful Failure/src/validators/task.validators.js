import { body } from "express-validator";

const STATUSES = ["todo", "in-progress", "done"];
const PRIORITIES = ["low", "medium", "high"];

export function taskRules({ isUpdate = false } = {}) {
  const title = isUpdate ? body("title").optional() : body("title");

  return [
    title
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .bail()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be 3 to 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be at most 500 characters"),
    body("status")
      .optional()
      .isIn(STATUSES)
      .withMessage(`Status must be one of: ${STATUSES.join(", ")}`),
    body("priority")
      .optional()
      .isIn(PRIORITIES)
      .withMessage(`Priority must be one of: ${PRIORITIES.join(", ")}`),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Due date must be a valid date")
      .bail()
      .custom((value) => new Date(value) > new Date())
      .withMessage("Due date must be in the future"),
    body("project")
      .optional()
      .isMongoId()
      .withMessage("Project must be a valid id"),
  ];
}
