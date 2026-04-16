/**
 * Adds each property to the options of a select box with key as value and value as textContent
 * @method
 * @instance
 * @memberOf HTMLSelectElement
 * @name importOptions
 * @param obj {object} value:text Dictionary
 * @returns {HTMLSelectElement}
*/

HTMLSelectElement.prototype.importOptions=function(obj){
  Object.entries(obj).forEach(a=>{var op=document.createElement("option");op.value=a[0];op.textContent=a[1];this.appendChild(op);});
  return this;
};

