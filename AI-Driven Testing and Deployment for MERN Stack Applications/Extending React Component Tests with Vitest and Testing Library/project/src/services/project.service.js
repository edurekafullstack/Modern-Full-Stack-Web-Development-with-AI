import { Project } from "../models/project.model.js";

export function findAll() {
  return Project.find().sort({ name: 1 });
}

export function create(data) {
  return Project.create(data);
}
