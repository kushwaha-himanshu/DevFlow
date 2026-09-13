import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    addMember
} from "../services/ProjectService.js";


// Create Project
const createProjectController = async (req, res) => {
    try {
        const project = await createProject(
            req.body,
            req.user._id
        );

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Get All Projects
const getProjectsController = async (req, res) => {
    try {
        const projects = await getProjects(req.user._id);

        res.status(200).json({
            success: true,
            projects
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Get Single Project
const getProjectByIdController = async (req, res) => {
    try {
        const project = await getProjectById(
            req.params.projectId,
            req.user._id
        );

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateProjectController = async (req, res) => {
    try {
        const project = await updateProject(
            req.params.projectId,
            req.user._id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const addMemberController = async (req, res) => {
    try {
        const { email, role } = req.body;

        const project = await addMember(
            req.params.projectId,
            req.user._id,
            email,
            role
        );

        res.status(200).json({
            success: true,
            message: "Member added successfully",
            project
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export {
    createProjectController,
    getProjectsController,
    getProjectByIdController,
    updateProjectController,
    addMemberController
};