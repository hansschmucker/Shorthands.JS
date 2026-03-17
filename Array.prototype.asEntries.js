/**
 * Returns all own properties of an object as an Array of name<->value pairs
 * @method
 * @instance
 * @memberOf Array
 * @name asEntries
 */

if(!Array.prototype.hasOwnProperty("asEntries")){
    Object.defineProperty(Array.prototype,"asEntries",{enumerable:false,value:function asEntries() {
        return Object.fromEntries(this);
    }});
}

