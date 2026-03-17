/**
 * Returns an array containing array with 0 being the item of this that was matches and 1 being an array of all entries of arr that returned true when passed to match
 * @method
 * @instance
 * @memberOf Array
 * @name joinLeft
 * @returns {Array}
 * @param secondArray {Array} Array to be joined
 * @param matcher {function} A callback to be called with each line of self (with params(selfLine,secondArrayLine)) to determine a match
 */
if(!Array.prototype.hasOwnProperty("joinLeft")){
    Object.defineProperty(Array.prototype,"joinLeft",{enumerable:false,value:function joinLeft(arr,match) {
        return this.map(a=>[a,arr.filter(b=>match(a,b))]);
    }});
}

