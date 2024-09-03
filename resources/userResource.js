const asyncHandler = require("express-async-handler");
const { formatDate } = require('../utils/dateUtils');

const userResource = asyncHandler(async (users) => {
    // Check if users is an array or a single object
    if (Array.isArray(users)) {
        // Handle array of users
        return Promise.all(users.map(async (user) => await formatUser(user)));
    } else {
        // Handle single user
        return await formatUser(users);
    }
});

// Helper function to format a single user
const formatUser = async (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        created_at: formatDate(user.createdAt),
        initials: getFirstLetters(user.name)
    };
};

// Helper function to get initials
const getFirstLetters = (name) => {
    if (!name) return "";
    
    // Split the name into words
    const words = name.trim().split(/\s+/);
    
    // Get the first letter of the first three words, capitalize them, and join them together
    return words.slice(0, 3).map(word => word[0].toUpperCase()).join('');
};

module.exports = userResource;
