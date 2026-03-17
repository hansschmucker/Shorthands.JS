/**
 * Returns the highest value in the array
 * @method
 * @instance
 * @memberOf Array
 * @name max
 * @returns {number}
 */

if(!Array.prototype.hasOwnProperty("max")){
    Object.defineProperty(Array.prototype,"max",{enumerable:false,max:function max() {
        return Math.max(...this);
    }});
}

