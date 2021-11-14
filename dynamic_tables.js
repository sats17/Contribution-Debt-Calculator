function generateTable() {
    var blank = "<td></td>"
    var head = "";
    for (i = 0; i < parseInt($("#contributors").val()); i++) {
        head += "<th contenteditable='true'>contributor name " + (i + 1) + "</th>";
    }
    head = "<tr>" + blank + head + "</tr>";
    var rows = "";
    var data = "";
    for (j = 0; j < parseInt($("#merchants").val()); j++) {
        data += "<td contenteditable='true'>merchant name " + j + "</td>";

        for (k = 0; k < parseInt($("#contributors").val()); k++) {
            data += "<td contenteditable='true'>" + 00 + "</td>";
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
    let totalContributors = parseInt($("#contributors").val());
    console.log(totalContributors)
    //gets table
    let transactionDataTable = document.getElementById('transactionDataTable');
    console.log(transactionDataTable)


    //gets rows of table
    let rowLength = transactionDataTable.rows.length;
    let header = transactionDataTable.rows.item(0).cells;
    //loops through rows by skipping header names
    let merchants = {}
    for (let i = 1; i < rowLength; i++) {
        //gets cells of current row
        let oCells = transactionDataTable.rows.item(i).cells;
        let merchantName = oCells.item(0).innerHTML
        let merchantData = {}
        let paymentData = {}
        let totalPayment = 0
        console.log("Current merchant "+merchantName)
        //gets amount of cells of current row
        let cellLength = oCells.length;
        //loops through each cell in current row
        for (let j = 1; j < cellLength; j++) {
            // get your cell info here
            let currentContributorPayment = parseInt(oCells.item(j).innerHTML);
            let currentContributorName = header.item(j).innerHTML;
            console.log("Contributor name " + currentContributorName)
            console.log("Contributor payment " + currentContributorPayment)
            paymentData[currentContributorName] = currentContributorPayment
            totalPayment = totalPayment + currentContributorPayment
        }
        merchantData['bill'] = totalPayment
        merchantData['payments'] = paymentData
        merchants[merchantName] = merchantData

    }
    console.log(JSON.stringify(merchants))
    let expense = merchants;
    // expense = {
    //     'food': {'bill': 250, 'payments': {'1': 20, '2': 32, '3': 43, '4': 35, '5': 65, '6': 12, '7': 43}},
    //     'rent': {'bill': 2492, 'payments': {'1': 902, '2': 98, '3': 84, '4': 35, '5': 32, '6': 552, '7': 789}},
    //     'vadapav': {'bill': 70, 'payments': {'1': 10, '2': 10, '3': 10, '4': 10, '5': 10, '6': 10, '7': 10}},
    //     'samosa': {'bill': 110, 'payments': {'1': 15, '2': 15, '3': 5, '4': 20, '5': 15, '6': 25, '7': 15}},
    //     'pizza': {'bill': 1700, 'payments': {'1': 50, '2': 150, '3': 200, '4': 250, '5': 300, '6': 350, '7': 400}}
    // }

//let a = zipPaymentAndNames(['a', 'b', 'c'], ['12', '14', '33','12'])
//differentiateCreditorAndDebtor(a, 14)
    let events = getDebtInformation(totalContributors, expense)
    console.log(events)
    alert(events)
}