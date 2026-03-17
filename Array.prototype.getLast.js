/**
 * Returns the last element of an array with optional filtering and default value
 * @method
 * @instance
 * @memberOf Array
 * @name getLast
 * @returns {Object|undefined}
 * @param filter {function} Optional callback to filter the array with before returning the last entry
 * @param default {Object} Optional return value if no entry in result.
 */
if(!Array.prototype.hasOwnProperty("getLast")){
    Object.defineProperty(Array.prototype,"getLast",{enumerable:false,value:function getLast(filter,def) {
        if(filter)
            var r= this.filter(filter);
        else
            var r=this;
        return r.length?r[r.length-1]:def;
    }});
}

