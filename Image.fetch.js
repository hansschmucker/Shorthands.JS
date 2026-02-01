Image.fetch=function(path){
    var img=document.createElement("img");
    return new Promise(function(resolve,reject){
        img.onload=resolve.bind(null,img);
        img.onerror=reject.bind(null,img);
        img.src=path;
    });
}
