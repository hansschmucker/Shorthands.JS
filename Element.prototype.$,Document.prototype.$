/**
* Returns an element matching the selector if the last part of the selector starts with #
* Otherwise returns all elements matching the selector in the subtree as array.
*/
Element.prototype.$=Document.prototype.$=function(sel){
  return /#[^\s\>~|]/.exec(sel)?
    this.querySelector(sel):
    [...this.querySelectorAll(sel)]
};
