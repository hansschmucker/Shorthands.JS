String.prototype.toUTF16=function(){
    var out=new Uint8Array(2+this.length*2);
    out[0]=0xFF;
    out[1]=0xFE;
    for(var i=0;i<this.length;i++){
        var c=this.charCodeAt(i);
        out[2+i*2]=c&0x00ff;
        out[2+i*2+1]=(c&0xff00)>>>8;
    }
    return out;
}
