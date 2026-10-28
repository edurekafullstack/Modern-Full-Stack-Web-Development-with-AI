import * as projectService from "../services/project.service.js";
import { success } from "../utils/response.js";

export async function getProjects(req, res) {
  const projects = await projectService.findAll();
  res.json(success({ count: projects.length, projects }, "Projects retrieved"));
}

export async function createProject(req, res) {
  const { name, description } = req.body ?? {};
  const project = await projectService.create({ name, description });
  res.status(201).json(success(project, "Project created"));
}
