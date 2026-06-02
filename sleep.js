/**
 * Sleeps a specified number of Milliseconds until fulfillment
 * @method
 * @instance
 * @memberOf Window
 * @name sleep
 * @async
 * @params time {number} Milliseconds until the promise is fullfilled
 * @returns {Promise}
 */

Window.prototype.sleep=function sleep(ms){
  return new Promise((ok,err)=>{
    window.setTimeout(ok,ms);
  });
};
