/**
 * Checks if an array contains the given parameter
 * @method
 * @instance
 * @memberOf Array
 * @name contains
 * @returns {boolean}
 * @param b {Object} Value to search for
 */

if(!Array.prototype.contains){
    Object.defineProperty(Array.prototype,"contains",{value:function contains(b) {
        return this.indexOf(b)>=0;
    }});
}
