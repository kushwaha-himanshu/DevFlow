import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        key: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                role: {
                    type: String,
                    enum: ["OWNER", "DEVELOPER", "VIEWER"],
                    default: "DEVELOPER"
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;