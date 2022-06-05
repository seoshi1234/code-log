function tableToObj(table) {
  var rows = table.rows;
  var propCells = rows[0].cells;
  var propNames = [];
  var results = [];
  var obj, row, cells;

  // Use the first row for the property names
  // Could use a header section but result is the same if
  // there is only one header row
  for (var i=0, iLen=propCells.length; i<iLen; i++) {
    propNames.push(propCells[i].textContent || propCells[i].innerText);
  }

  // Use the rows for data
  // Could use tbody rows here to exclude header & footer
  // but starting from 1 gives required result
  for (var j=1, jLen=rows.length; j<jLen; j++) {
    cells = rows[j].cells;
    obj = {};

    for (var k=0; k<iLen; k++) {
      obj[propNames[k]] = cells[k].textContent || cells[k].innerText;
    }
    results.push(obj)
  }  
  return results;
}

function getLanguageTableAndSet(setLanguageTable){
  fetch('https://intense-peak-34491.herokuapp.com/https://rdmd.readme.io/docs/code-blocks').then((response)=>{
    return response.text();
  }).then((html)=>{
    
    var parser = new DOMParser();
    var doc = parser.parseFromString(html,'text/html');
    var table = doc.querySelector('article .rdmd-table-inner table');        
    var tableObj = tableToObj(table);
    tableObj.sort((a,b)=>{
      return b['Language'].length - a['Language'].length;
    })
    tableObj.map((each)=>{
      var eachModes = each['Available language mode(s)'];
      eachModes = eachModes.split(', ');
      eachModes = eachModes.map((e)=>{
        e = e.replace(/,/g,'');
        e = e.replace(/\+/g,'\\+');        
        return e;
      })      
      eachModes.sort((a,b)=>{
        return b.length - a.length;
      })      
      each['Available language mode(s)'] = eachModes;
      return each;
    })
    setLanguageTable(tableObj);    
    console.log(tableObj)
    return tableObj;    
  })
}


export default getLanguageTableAndSet;