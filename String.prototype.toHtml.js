String.prototype.toHtml=function(){
    var s=document.createElement("span");
    s.textContent=this;
    return s.innerHTML;
}
