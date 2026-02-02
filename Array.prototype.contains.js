/**
 * Checks if an array contains the given parameter
 * @returns {boolean}
 * @param b Value to search for
 */
Array.prototype.contains=function(b) {
    return this.indexOf(b)>=0;
};
