/*
	Variant of https://github.com/pwasystem/zip/ (public domain)
*/

/**
 * Uncompressed zip file
 *
 * @param nameOrData Either basename of zip file if no initial data or just the data if no specific name is required
 * @param data Data if a basename is required
 * @constructor
 */
function PlainZip(nameOrData,data){
	if(typeof(nameOrData)=="object"){
		data=nameOrData;
		nameOrData="";
	}
	this.name = nameOrData||this._guid();
	this.zip = [];
	this.file = [];
	this.finalized=false;
	if(data)
		this.addData(data);
}

PlainZip.prototype._guid=()=>Array.prototype.slice.call(crypto.getRandomValues(new Uint8Array(16))).map(a=>("0"+a.toString(16)).slice(-2)).join("");
PlainZip.prototype._dec2bin=(dec, size)=>dec.toString(2).padStart(size,'0');
PlainZip.prototype._str2hex= str=>[...new TextEncoder().encode(str)].map(x=>x.toString(16).padStart(2,'0'));
PlainZip.prototype._hex2buf= hex=>new Uint8Array(hex.split(' ').map(x=>parseInt(x,16)));
PlainZip.prototype._bin2hex= bin=>(parseInt(bin.slice(8),2).toString(16).padStart(2,'0')+' '+parseInt(bin.slice(0,8),2).toString(16).padStart(2,'0'));

PlainZip.prototype._reverse= hex=>{
	let hexArray=[];
	for(let i=0;i<hex.length;i=i+2)hexArray[i]=hex[i]+''+hex[i+1];
	return hexArray.filter((a)=>a).reverse().join(' ');
};

PlainZip.prototype._crc32=function(r){
	let a,o,c,n;
	for(o=[],c=0;c<256;c++){
		a=c;
		for(let f=0;f<8;f++)
			a=1&a?3988292384^a>>>1:a>>>1;
		o[c]=a;
	}
	for(n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r[t])];
	return this._reverse(((-1^n)>>>0).toString(16).padStart(8,'0'));
};

/**
 * Adds data to the zip file
 *
 * @param arrayOfData Data must be [{name:string,data:Uint8Array/string,modified:unixTimestamp?}] or a dictionary {name:data}
 */
PlainZip.prototype.addData=function(arrayOfData){
	if(this.finalized)
		throw new Error("File already finalized");

	var enc=new TextEncoder();

	if(arrayOfData instanceof Array) {
		for (let i = 0; i < arrayOfData.length; i++) {
			let uint = typeof (arrayOfData[i].data) == "string" ? enc.encode(arrayOfData[i].data) : arrayOfData[i].data;
			uint.name = arrayOfData[i].name;
			uint.modTime = arrayOfData[i].lastModified || +new Date();
			uint.fileUrl = `${arrayOfData[i].name}`;
			this.zip[uint.fileUrl] = uint;
		}
	}else{
		for (let i in arrayOfData) {
			let uint = typeof (arrayOfData[i]) == "string" ? enc.encode(arrayOfData[i]) : arrayOfData[i];
			uint.name = i;
			uint.modTime = +new Date();
			uint.fileUrl = `${i}`;
			this.zip[uint.fileUrl] = uint;
		}
	}
};

/**
 * Locks the Zip file and returns the byte stream
 * @returns Uint8Array
 */
PlainZip.prototype.finalize=function(){
	if(this.finalized)
		return this.file;

	let count=0;
	let centralDirectoryFileHeader='';
	let directoryInit=0;
	let offSetLocalHeader='00 00 00 00';
	let zip=this.zip;
	for(const name in zip){
		if(!zip.hasOwnProperty(name))
            continue;
		let modTime=(()=>{
			const lastMod=new Date(zip[name].modTime);
			const hour=this._dec2bin(lastMod.getHours(),5);
			const minutes=this._dec2bin(lastMod.getMinutes(),6);
			const seconds=this._dec2bin(Math.round(lastMod.getSeconds()/2),5);
			const year=this._dec2bin(lastMod.getFullYear()-1980,7);
			const month=this._dec2bin(lastMod.getMonth()+1,4);
			const day=this._dec2bin(lastMod.getDate(),5);
			return this._bin2hex(`${hour}${minutes}${seconds}`)+' '+this._bin2hex(`${year}${month}${day}`);
		})();
		let crc=this._crc32(zip[name]);
		let size=this._reverse(parseInt(zip[name].length).toString(16).padStart(8,'0'));
		let nameFile=this._str2hex(zip[name].fileUrl).join(' ');
		let nameSize=this._reverse(zip[name].fileUrl.length.toString(16).padStart(4,'0'));
		let fileHeader=`50 4B 03 04 14 00 00 00 00 00 ${modTime} ${crc} ${size} ${size} ${nameSize} 00 00 ${nameFile}`;
		let fileHeaderBuffer=this._hex2buf(fileHeader);
		directoryInit=directoryInit+fileHeaderBuffer.length+zip[name].length;
		centralDirectoryFileHeader=`${centralDirectoryFileHeader}50 4B 01 02 14 00 14 00 00 00 00 00 ${modTime} ${crc} ${size} ${size} ${nameSize} 00 00 00 00 00 00 01 00 20 00 00 00 ${offSetLocalHeader} ${nameFile} `;
		offSetLocalHeader=this._reverse(directoryInit.toString(16).padStart(8,'0'));
		this.file.push(fileHeaderBuffer,new Uint8Array(zip[name]));
		count++;
	}
	centralDirectoryFileHeader=centralDirectoryFileHeader.trim();
	let entries=this._reverse(count.toString(16).padStart(4,'0'));
	let dirSize=this._reverse(centralDirectoryFileHeader.split(' ').length.toString(16).padStart(8,'0'));
	let dirInit=this._reverse(directoryInit.toString(16).padStart(8,'0'));
	let centralDirectory=`50 4b 05 06 00 00 00 00 ${entries} ${entries} ${dirSize} ${dirInit} 00 00`;
	this.file.push(this._hex2buf(centralDirectoryFileHeader),this._hex2buf(centralDirectory));
	return this.file;
};

/**
 * Locks the Zip file and returns an object url
 * @returns string
 */
PlainZip.prototype.getObjectURL=function(){
	this.finalize();
	return URL.createObjectURL(new Blob([...this.file],{type:'application/octet-stream'}));
};

/**
 * Locks the Zip file and initiates a download
 */
PlainZip.prototype.download=function(){
	let a = document.createElement('a');
	a.href = this.getObjectURL();
	a.download = `${this.name}.zip`;
	a.click();
};
