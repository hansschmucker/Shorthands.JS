/**
 * Executes a method on a promise once it is fullfilled, effectively replacing simple then() chains. Every additional argument after the name is passed to the named function.
 * @example await fetch(".").chain("text")
 * @method
 * @instance
 * @memberOf Promise
 * @name chain
 * @params name {string} Name of the method to be called
 * @returns {Promise}
 */

Promise.prototype.chain=async function(name){
    return await this.then(function(a){return a[name].apply(a,[...arguments].slice(1));});
};
