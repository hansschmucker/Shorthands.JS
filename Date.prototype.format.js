/**
 * Returns a string representing the given date. Supported are yyyy(Year4), yy(Year2), MM(Month2), dd(Date2), d(Date), HH(Hour2), mm(Minutes2), ss(Seconds2)
 * @method
 * @instance
 * @memberOf Date
 * @name format
 * @param formatString {string} formatString to use for laying out the date
 * @returns {string}
 */
Date.prototype.format=function(str){
	return str.
		replace("yyyy",this.getFullYear().toString().padStart(4,'0')).
		replace("yy",this.getFullYear().toString().padStart(2,'0').substr(-2)).
		replace("MM",(this.getMonth()+1).toString().padStart(2,'0')).
		replace("dd",this.getDate().toString().padStart(2,'0')).
		replace("d",this.getDate().toString()).
		replace("HH",this.getHours().toString().padStart(2,'0')).
		replace("mm",this.getMinutes().toString().padStart(2,'0')).
		replace("ss",this.getSeconds().toString().padStart(2,'0'))
		;
};
