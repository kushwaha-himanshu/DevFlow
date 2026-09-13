import {
    createProject as createProjectRepository,
    findProjectById,
    findProjectsByMember,
    updateProject as updateProjectRepository,
    addMember as addMemberRepository
} from "../repositories/ProjectRepository.js";
import {
    findUserByEmail
} from "../repositories/UserRepository.js";


// Create a new project
const createProject = async (projectData, userId) => {
    const { name, description, key } = projectData;

    // Basic validation
    if (!name || !name.trim()) {
        throw new Error("Project name is required");
    }

    // Generate key if frontend doesn't provide one
    let projectKey = key;

    if (!projectKey) {
        projectKey = name
            .trim()
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 3)
            .toUpperCase();
    }

    projectKey = projectKey.toUpperCase().trim();

    const project = await createProjectRepository({
        name: name.trim(),
        description: description?.trim() || "",
        key: projectKey,

        owner: userId,

        members: [
            {
                user: userId,
                role: "OWNER"
            }
        ]
    });

    return project;
};


// Get all projects of logged-in user
const getProjects = async (userId) => {
    const projects = await findProjectsByMember(userId);

    return projects;
};


// Get a single project
const getProjectById = async (projectId, userId) => {
    const project = await findProjectById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    // Check if user is a member
    const isMember = project.members.some(
        (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
        throw new Error("You are not a member of this project");
    }

    return project;
};

// Update a project
const updateProject = async (projectId, userId, updateData) => {

    const project = await findProjectById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    // Find user's role in this project
    const member = project.members.find(
        (member) => member.user.toString() === userId.toString()
    );

    if (!member) {
        throw new Error("You are not a member of this project");
    }

    // Only OWNER can update project
    if (member.role !== "OWNER") {
        throw new Error("Only project owner can update the project");
    }

    const allowedUpdates = {};

    if (updateData.name !== undefined) {
        if (!updateData.name.trim()) {
            throw new Error("Project name cannot be empty");
        }

        allowedUpdates.name = updateData.name.trim();
    }

    if (updateData.description !== undefined) {
        allowedUpdates.description = updateData.description.trim();
    }

    if (updateData.key !== undefined) {
        allowedUpdates.key = updateData.key.toUpperCase().trim();
    }

    const updatedProject = await updateProjectRepository(
        projectId,
        allowedUpdates
    );

    return updatedProject;
};

const addMember = async (projectId, ownerId, email, role) => {

    // 1. Find the project
    const project = await findProjectById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }


    // 2. Check the requester is a member of the project
    const member = project.members.find(
        (member) =>
            member.user.toString() === ownerId.toString()
    );

    if (!member) {
        throw new Error("You are not a member of this project");
    }


    // 3. Only OWNER can add members
    if (member.role !== "OWNER") {
        throw new Error("Only project owner can add members");
    }


    // 4. Validate role
    if (!["DEVELOPER", "VIEWER"].includes(role)) {
        throw new Error("Invalid member role");
    }


    // 5. Find user by email
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("User not found");
    }


    // 6. Check if user is already a member
    const alreadyMember = project.members.some(
        (member) =>
            member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
        throw new Error("User is already a member of this project");
    }


    // 7. Add member
    const updatedProject = await addMemberRepository(
        projectId,
        user._id,
        role
    );

    return updatedProject;
};

export {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    addMember
};