/*
    Returns the first element of an array with optional filtering and default value
 */
Array.prototype.first=function(filter,def){
    if(filter)
        var r=this.filter(filter);
    else
        var r=this;

    return r.length?r[0]:def;
};
