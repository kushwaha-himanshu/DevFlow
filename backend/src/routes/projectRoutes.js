import express from "express";

import {
    createProjectController,
    getProjectsController,
    getProjectByIdController,
    updateProjectController,
    addMemberController,
    removeMemberController
} from "../controllers/ProjectController.js";

import {verifyJwt} from "../middlewares/authMiddleware.js";

const router = express.Router();


// Create Project
router.post(
    "/",
    verifyJwt,
    createProjectController
);


// Get All Projects
router.get(
    "/",
    verifyJwt,
    getProjectsController
);


// Get Single Project
router.get(
    "/:projectId",
    verifyJwt,
    getProjectByIdController
);
// Update Project
router.put(
    "/:projectId",
    verifyJwt,
    updateProjectController
);
// Add Member to Project
router.post(
    "/:projectId/members",
    verifyJwt,
    addMemberController
);

// Remove Member from Project
router.delete(
    "/:projectId/members/:userId",
    verifyJwt,
    removeMemberController
);
export default router;