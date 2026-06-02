/**
 * Sleeps a specified number of Milliseconds until fulfillment
 * @name sleep
 * @params time {number} Milliseconds until the promise is fullfilled
 * @returns {Promise}
 */

Window.prototype.sleep=function sleep(ms){
  return new Promise((ok,err)=>{
    window.setTimeout(ok,ms);
  });
};
