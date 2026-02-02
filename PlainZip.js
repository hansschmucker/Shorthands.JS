/*
    Variant of https://github.com/pwasystem/zip/ (public domain)
*/
function PlainZip(name,data){
	if(typeof(name)=="object"){
		data=name;
		name="";
	}
	this.name = name||this.guid();
	this.zip = [];
	this.file = [];
	this.finalized=false;
	if(data)
		this.addData(data);
}

PlainZip.prototype.guid=()=>Array.prototype.slice.call(crypto.getRandomValues(new Uint8Array(16))).map(a=>("0"+a.toString(16)).slice(-2)).join("");
PlainZip.prototype.dec2bin=(dec,size)=>dec.toString(2).padStart(size,'0');
PlainZip.prototype.str2hex=str=>[...new TextEncoder().encode(str)].map(x=>x.toString(16).padStart(2,'0'));
PlainZip.prototype.hex2buf=hex=>new Uint8Array(hex.split(' ').map(x=>parseInt(x,16)));
PlainZip.prototype.bin2hex=bin=>(parseInt(bin.slice(8),2).toString(16).padStart(2,'0')+' '+parseInt(bin.slice(0,8),2).toString(16).padStart(2,'0'));

PlainZip.prototype.reverse=hex=>{
	let hexArray=[];
	for(let i=0;i<hex.length;i=i+2)hexArray[i]=hex[i]+''+hex[i+1];
	return hexArray.filter((a)=>a).reverse().join(' ');
};

PlainZip.prototype.crc32=function(r){
	let a,o,c,n;
	for(o=[],c=0;c<256;c++){
		a=c;
		for(let f=0;f<8;f++)
			a=1&a?3988292384^a>>>1:a>>>1;
		o[c]=a;
	}
	for(n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r[t])];
	return this.reverse(((-1^n)>>>0).toString(16).padStart(8,'0'));
};

/*
	Data must be [{name:string,data:Uint8Array/string,modified:unixTimestamp?}]
	or {name:data}
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

PlainZip.prototype.finalize=function(){
	if(this.finalized)
		return this.file;

	let count=0;
	let centralDirectoryFileHeader='';
	let directoryInit=0;
	let offSetLocalHeader='00 00 00 00';
	let zip=this.zip;
	for(const name in zip){
		let modTime=(()=>{
			const lastMod=new Date(zip[name].modTime);
			const hour=this.dec2bin(lastMod.getHours(),5);
			const minutes=this.dec2bin(lastMod.getMinutes(),6);
			const seconds=this.dec2bin(Math.round(lastMod.getSeconds()/2),5);
			const year=this.dec2bin(lastMod.getFullYear()-1980,7);
			const month=this.dec2bin(lastMod.getMonth()+1,4);
			const day=this.dec2bin(lastMod.getDate(),5);
			return this.bin2hex(`${hour}${minutes}${seconds}`)+' '+this.bin2hex(`${year}${month}${day}`);
		})();
		let crc=this.crc32(zip[name]);
		let size=this.reverse(parseInt(zip[name].length).toString(16).padStart(8,'0'));
		let nameFile=this.str2hex(zip[name].fileUrl).join(' ');
		let nameSize=this.reverse(zip[name].fileUrl.length.toString(16).padStart(4,'0'));
		let fileHeader=`50 4B 03 04 14 00 00 00 00 00 ${modTime} ${crc} ${size} ${size} ${nameSize} 00 00 ${nameFile}`;
		let fileHeaderBuffer=this.hex2buf(fileHeader);
		directoryInit=directoryInit+fileHeaderBuffer.length+zip[name].length;
		centralDirectoryFileHeader=`${centralDirectoryFileHeader}50 4B 01 02 14 00 14 00 00 00 00 00 ${modTime} ${crc} ${size} ${size} ${nameSize} 00 00 00 00 00 00 01 00 20 00 00 00 ${offSetLocalHeader} ${nameFile} `;
		offSetLocalHeader=this.reverse(directoryInit.toString(16).padStart(8,'0'));
		this.file.push(fileHeaderBuffer,new Uint8Array(zip[name]));
		count++;
	}
	centralDirectoryFileHeader=centralDirectoryFileHeader.trim();
	let entries=this.reverse(count.toString(16).padStart(4,'0'));
	let dirSize=this.reverse(centralDirectoryFileHeader.split(' ').length.toString(16).padStart(8,'0'));
	let dirInit=this.reverse(directoryInit.toString(16).padStart(8,'0'));
	let centralDirectory=`50 4b 05 06 00 00 00 00 ${entries} ${entries} ${dirSize} ${dirInit} 00 00`;
	this.file.push(this.hex2buf(centralDirectoryFileHeader),this.hex2buf(centralDirectory));
	return this.file;
};

PlainZip.prototype.getObjectURL=function(){
	this.finalize();
	return URL.createObjectURL(new Blob([...this.file],{type:'application/octet-stream'}));
};

PlainZip.prototype.download=function(){
	let a = document.createElement('a');
	a.href = this.getObjectURL();
	a.download = `${this.name}.zip`;
	a.click();
};
