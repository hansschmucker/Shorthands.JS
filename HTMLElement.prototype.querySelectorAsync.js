HTMLElement.prototype.querySelectorAsync=async function(selector){
	var initial=this.querySelector(selector);
	if(initial)
	  return initial;
	
	return new Promise(function(done,abort){
		new MutationObserver(function(selector,mutationList, observer){
			var r=this.querySelector(selector);
			if(r){
				observer.disconnect();
				done(r);
			}
		}.bind(this,selector)).observe(this, { attributes: true, childList: true, subtree: true });
	}.bind(this));
};

Document.prototype.querySelectorAsync=async function(selector){
	return this.documentElement.querySelectorAsync(selector);
};
