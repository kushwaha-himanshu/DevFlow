
import Project from "../models/project.js";

const createProject = async (projectData) => {
    const project = await Project.create(projectData);
    return project;
};

const findProjectById = async (projectId) => {
    const project = await Project.findById(projectId);
    return project;
};

const findProjectsByMember = async (userId) => {
    const projects = await Project.find({
        "members.user": userId
    });

    return projects;
};


const updateProject = async (projectId, updateData) => {
    const project = await Project.findByIdAndUpdate(
        projectId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    return project;
};

const addMember = async (projectId, userId, role) => {
    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            $push: {
                members: {
                    user: userId,
                    role: role
                }
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return project;
};
export {
    createProject,
    findProjectById,
    findProjectsByMember,
    updateProject,
    addMember
}