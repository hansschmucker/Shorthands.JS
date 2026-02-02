/**
 * Returns all distinct values of an array
 */

Array.prototype.distinct=function() {
    return this.reduce((p,a)=>{
        if(p.indexOf(a)<0)
            p.push(a);
        return p;
    },[])
};
