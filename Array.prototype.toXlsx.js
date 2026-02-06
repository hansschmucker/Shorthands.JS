Array.prototype.toXlsx=function(name){
    var doc = new DOMParser().parseFromString("<root />", "application/xml");
    var root=doc.documentElement;
    for(var i=0;i<this.length;i++){
        var row=doc.createElement("row");
        for(var j=0;j<this[i].length;j++){
            var cell=doc.createElement("c");
            cell.setAttribute("t","inlineStr");
            var cellContent=doc.createElement("is");
            cell.appendChild(cellContent);
            var cellText=doc.createElement("t");
            cellContent.appendChild(cellText);
            cellText.textContent=""+this[i][j];
            row.appendChild(cell);
        }
        root.appendChild(row);
    }
    var content=doc.documentElement.innerHTML;
    var zip=new PlainZip(name,{
        '_rels/.rels':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="workbook.xml"/></Relationships>',
        '_rels/workbook.xml.rels':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheet.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
        '[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/worksheet.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
        'workbook.xml':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Index" sheetId="1" r:id="rId1"/></sheets></workbook>',
        'worksheet.xml':'<?xml version="1.0" encoding="utf-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetData>'+content+'</sheetData></worksheet>'
    });
    zip.mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    return zip;
}
