String.prototype.toXml=function(){
    return (new DOMParser().parseFromString(this, "application/xml")).documentElement;
};
