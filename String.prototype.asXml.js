/**
 * Parses xml and returns the document xml
 * @returns {Element}
 */
String.prototype.asXml=function(){
    return (new DOMParser().parseFromString(this, "application/xml")).documentElement;
};
