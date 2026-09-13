import User from "../models/user.js";

const findUserByEmail = async (email) => {
    const user = await User.findOne({
        email: email.toLowerCase().trim()
    });

    return user;
};

export {
    findUserByEmail
};