import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.routes.js"
import projectRoutes from "./routes/projectRoutes.js"
const allowedOrigins = ["*",
    "http://localhost:5173"
];

const app = express();

app.use(
    cors({
        origin: function(origin, callback){
            if(!origin || allowedOrigins.includes(origin)){
                callback(null,true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials:true
    })
);
//common middleware for acceptiong json formate file
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
// for parsing  cookies 
app.use(cookieParser());
// routes import
app.use("/api/auth", userRoutes)
app.use("/api/projects", projectRoutes)
export {app}