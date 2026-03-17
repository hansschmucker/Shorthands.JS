/**
 * Groups an array into a nested tree meaning for each param the array that would be an array turns itself into a value:results dictionary
 * @method
 * @instance
 * @memberOf Array
 * @name groupBy
 * @returns {Object}
 * @param grouper1 {function|string} Either a callback to be used for grouping or the name of a field
 * @param grouper2 {function|string} Either a callback to be used for grouping or the name of a field to be performed on each result of grouper1
 * @param grouperN {function|string} Either a callback to be used for grouping or the name of a field to be performed on each result of previous grouper
 */
if(!Array.prototype.hasOwnProperty("groupBy")){
  Object.defineProperty(Array.prototype,"groupBy",{enumerable:false,value:function groupBy(args) {
    args=[...arguments];
    
    var data=Object.groupBy(this,typeof(args[0])=="function"?args[0]:function(field,line){ return line[field]; }.bind(null,args[0]) );
    if(args.length>1)
      for(var i in data)
          data[i]=data[i].groupBy.apply(data[i],args.slice(1));
    return data;
  }});
}

