function generateTable() {
      var blank = "<td></td>"
      var head = "";
      for (i = 0; i < parseInt($("#col").val()); i++) {
        head += "<th contenteditable='true'>contributor name "+ (i + 1) + "</th>";
      }
      head = "<tr>"+blank + head + "</tr>";
      var rows = "";
      var data = "";
      for (j = 0; j < parseInt($("#row").val()); j++) {
        data += "<td contenteditable='true'>merchant name "+j+"</td>";

        for (k = 0; k < parseInt($("#col").val()); k++) {
          data += "<td contenteditable='true'>" +00+ "</td>";
        }
        rows += "<tr>" + data + "</tr>";
        data = "";

      }

      var table = "<table border='1px' id='transactionDataTable'>" + head + rows + "</table>";
      var submitButton = "<input type='button' value='Submit' onclick='onSubmitClick();' />"

      $("#dydiv").empty();
      $("#dydiv").append(table);
      $("#dydiv").append(submitButton);
}

function onSubmitClick() {
    console.log("Test")
    //gets table
    var transactionDataTable = document.getElementById('transactionDataTable');
    console.log(transactionDataTable)

    //gets rows of table
    var rowLength = transactionDataTable.rows.length;
    var header = transactionDataTable.rows.item(0).cells;
    //loops through rows
    for (i = 1; i < rowLength; i++){
      //gets cells of current row
       var oCells = transactionDataTable.rows.item(i).cells;
       //gets amount of cells of current row
       var cellLength = oCells.length;
       //loops through each cell in current row
       for(var j = 0; j < cellLength; j++){
              // get your cell info here
              var cellVal = oCells.item(j).innerHTML;
              var headerValue = header.item(j).innerHTML;
              console.log("header name "+headerValue)
              console.log("each data "+cellVal)
           }
    }
}