/**
 * Returns all distinct values of an array
 * @method
 * @instance
 * @memberOf Array
 * @name distinct
 * @returns {Array}
 * @param serialize {boolean} If set will return distinct JSON-serialized (deserialized again after distinct)
 */
if(!Array.prototype.hasOwnProperty("distinct")){
    Object.defineProperty(Array.prototype,"distinct",{enumerable:false,value:function distinct(serialize) {
        if(serialize){
            return this.map(a=>a.toJson()).distinct().map(a=>a.asJson());
        }else{
            return this.reduce((p,a)=>{
                if(p.indexOf(a)<0)
                    p.push(a);
                return p;
            },[]);
        }
    }});
}

