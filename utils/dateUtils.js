/**
 * Converts an ISO 8601 date string to Y-m-d H:i:s format.
 * @param {string} isoDate - The ISO 8601 date string.
 * @returns {string} - The formatted date string.
 */
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.getFullYear() + '-' +
           String(date.getMonth() + 1).padStart(2, '0') + '-' +
           String(date.getDate()).padStart(2, '0');
}

function formatDateTime(isoDate) {
    const date = new Date(isoDate);
    return date.getFullYear() + '-' +
           String(date.getMonth() + 1).padStart(2, '0') + '-' +
           String(date.getDate()).padStart(2, '0') + ' ' +
           String(date.getHours()).padStart(2, '0') + ':' +
           String(date.getMinutes()).padStart(2, '0') + ':' +
           String(date.getSeconds()).padStart(2, '0');
}

module.exports = {
    formatDate,
    formatDateTime
};
