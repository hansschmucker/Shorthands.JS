/*
    Returns the last element of an array with optional filtering and default value
 */
Array.prototype.last=function(filter,def){
    if(filter)
        var r= this.filter(filter);
    else
        var r=this;
    return r.length?r[r.length-1]:def;
};
