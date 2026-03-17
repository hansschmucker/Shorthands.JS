/**
 * Returns the first element of an array with optional filtering and default value
 * @method
 * @instance
 * @memberOf Array
 * @name getFirst
 * @returns {Object|undefined}
 * @param filter {function} Optional callback to filter the array with before returning the first entry
 * @param default {Object} Optional return value if no entry in result.
 */
if(!Array.prototype.hasOwnProperty("getFirst")){
    Object.defineProperty(Array.prototype,"getFirst",{enumerable:false,value:function getFirst(filter,def) {
        if(filter)
            var r=this.filter(filter);
        else
            var r=this;
    
        return r.length?r[0]:def;
    }});
}

