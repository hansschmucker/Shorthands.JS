/**
	Adds a second param to createElement which may contain a dictionary-like object of attributes
*/
(()=>{
	if(Document.prototype.createElement.createElementAttr)
		return;
		
	var createElement=Document.prototype.createElement;
	
	Document.prototype.createElement=function(name,attrs){
		var el=createElement.call(this,name);
		if(attrs)
			for(var i in attrs)
				if(attrs.hasOwnProperty(i))
					el.setAttribute(i,attrs[i]);
		return el;
	};
	
	Document.prototype.createElement.createElementAttr=true;
})();
