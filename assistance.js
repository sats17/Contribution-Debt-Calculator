
/* Main function which will get all debt information, parameters are expense which is detail transaction information
 and total members who involved in transactions.
Sample expense :
{
    'food': {'bill': 95, 'payments': {'firstMember': 20, 'secondMember': 32, 'thirdMember': 43}},
    'rent': {'bill': 52, 'payments': {'firstMember': 20, 'secondMember': 32, 'thirdMember': 00}}
}
*/
function getDebtInformation(totalMembers, expense){
    console.log("Total members involved in transaction "+ totalMembers)
    console.log("Detail transaction data "+ JSON.stringify(expense))
    var names = extractMembersNames(expense)
    var totalBill = calculateTotalBill(expense)
    console.log("Calculated total bill "+ totalBill)
    var expectedContributionBillFromEachMember = calculateExpectedContributionFromEachMember(totalBill, totalMembers)
    console.log("Expected contribution from each members "+ expectedContributionBillFromEachMember)
    var totalPayFromEachMemberForEachSource = calculateTotalPaymentByEachMembers(expense, totalMembers)
    console.log("Total payment done by each member ", totalPayFromEachMemberForEachSource)
    var zippedPaymentData = zipPaymentAndNames(names, totalPayFromEachMemberForEachSource)
    console.log("Zipped payment data with member names "+JSON.stringify(zippedPaymentData))
    var differentiatedResponse = differentiateCreditorAndDebtor(zippedPaymentData, expectedContributionBillFromEachMember)
    console.log("Differentiated creditor and debtor response "+ JSON.stringify(differentiatedResponse))
    var events = generateResolvedContributionEvents(differentiatedResponse)
    console.log(events)
    return events
}


function round(value) {
    let decimals = 3;
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function calculateTotalBill(expense){
    let totalBill = 0
    for (let i in expense) {
        totalBill = totalBill + expense[i]["bill"]
    }
    return totalBill
}

function calculateExpectedContributionFromEachMember(totalBill, member){
    return round(totalBill / member)
}

function calculateTotalPaymentByEachMembers(expense, totalMembers) {
    var totalMembersPaymentArray = []
    var tempArrayForTotalPayment = []
    // Create array of payments
    for (let i in expense) {
        tempPayment = []
        payments = expense[i]['payments']
        for (let names in payments){
            tempPayment.push(payments[names])
        }
        tempArrayForTotalPayment.push(tempPayment)
    }
    console.log("Payments array ", tempArrayForTotalPayment)
    let memberCounter = 0

    // Calculate total payment of each members from nested array
    // Performing nested loop on nested array so we can fetch each member payments from nested array
    while(memberCounter < totalMembers) {
        let memberPaymentSourceCounter = 0
        var totalPaymentByEachMember = 0
        while(memberPaymentSourceCounter < tempArrayForTotalPayment.length) {
            totalPaymentByEachMember = tempArrayForTotalPayment[memberPaymentSourceCounter][memberCounter] + totalPaymentByEachMember
            memberPaymentSourceCounter++
        }
        totalMembersPaymentArray.push(totalPaymentByEachMember)
        memberCounter++
    }
    return totalMembersPaymentArray;
}

function zipPaymentAndNames(names, payments){
    zippedData = {}
    counter = 0
    while(counter < names.length){
        zippedData[names[counter]] = payments[counter]
        counter++
    }
    return zippedData
}

function extractMembersNames(expense){
    names = []
    for (let i in expense){
        let paymentList = expense[i]
        for (let name in paymentList["payments"]) {
            names.push(name)
        }
        break
    }
    return names
}

// Function compares expectedContributionBill with total payment of each members and bifurcate them into creditor, debtor
// and even
function differentiateCreditorAndDebtor(zippedPaymentData, expectedContributionBill){
    differentiatedResponse = {}
    creditor = {}
    debtor = {}
    even = {}
    for(let name in zippedPaymentData){
        paymentFromMember = zippedPaymentData[name]
        if(paymentFromMember < expectedContributionBill){
            creditor[name] = round(expectedContributionBill - paymentFromMember)
        } else if( paymentFromMember > expectedContributionBill) {
            debtor[name] = round(paymentFromMember - expectedContributionBill)
        } else {
            even[name] = 0
        }
    }
    differentiatedResponse['creditor'] = creditor
    differentiatedResponse['debtor'] = debtor
    differentiatedResponse['even'] = even
    return differentiatedResponse
}

// Function calculate who have to pay debt whom by comparing debtor and creditor in differentiatedResponse.
function generateResolvedContributionEvents(differentiatedResponse) {
    var events = []
    var creditor = differentiatedResponse['creditor']
    var debtor = differentiatedResponse['debtor']
    var creditCounter = 0
    var debtCounter = 0
    // Converting JSON object to array entries
    var creditorsList = Object.entries(creditor);
    var debtorsList = Object.entries(debtor);

    // Looping over each creditorList and debtorList anc checking who will give debt to whom
    while(creditCounter < creditorsList.length && debtCounter < debtorsList.length){
        // Running creditorList and debtorList simultaneously, once operations on both list completed then breaking
        // this loop to avoid array index out of bound errors
        // Deprecated this logic and puts this condition under while loop
//        if(creditCounter > creditorsList.length - 1 && debtCounter > debtorsList.length - 1){
//            break
//        }
        currentCreditor = creditorsList[creditCounter]
        currentDebtor = debtorsList[debtCounter]
        // When Credit person have less amount that debit person, then creditor pay all his amount to debtor
        // Compromising point values comparison using int function
        if(currentCreditor[1] != 0 && int(currentCreditor[1]) < int(currentDebtor[1])){
            events.push(eventGenerator(currentCreditor[0], round(currentCreditor[1]), currentDebtor[0]))
            exchangeAmount = round(creditorsList[creditCounter][1])
            creditorsList[creditCounter][1] = 0
            debtorAmount = round(debtorsList[debtCounter][1])
            debtorsList[debtCounter][1] = round(debtorAmount - exchangeAmount)
            creditCounter = creditCounter + 1  // Increase counter to iterate to next debtor
        }
        // When debit person have less amount that credit person, then creditor will pay only amount that debtor have
        // Compromising point values comparison using int function
        if(currentDebtor[1] != 0 && int(currentCreditor[1]) > int(currentDebtor[1])){
            events.push(eventGenerator(currentCreditor[0], round(currentDebtor[1]), currentDebtor[0]))
            exchangeAmount = round(debtorsList[debtCounter][1])
            debtorsList[debtCounter][1] = 0
            creditorAmount = round(creditorsList[creditCounter][1])
            creditorsList[creditCounter][1] = round(creditorAmount - exchangeAmount)
            debtCounter = debtCounter + 1  // Increase counter to iterate to next debtor
        }
        // When credit person and debit person have equal amount, then creditor will pay whatever he have to debtor
        // Compromising point values comparison using int function
        if(currentDebtor[1] != 0 && currentCreditor[1] != 0 && int(currentCreditor[1]) == int(currentDebtor[1])){
            events.push(eventGenerator(currentCreditor[0], round(currentCreditor[1]), currentDebtor[0]))
            creditorsList[creditCounter][1] = 0
            debtorsList[debtCounter][1] = 0
            debtCounter = debtCounter + 1  // Increase counter to iterate to next debtor
            creditCounter = creditCounter + 1  // Increase counter to iterate to next creditor
        }
    }
    return events
}

// Convert float values to int
function int(value){
    return Math.floor(value)
}


function eventGenerator(creditorName, amount, debtorName){
    console.log(creditorName.toString() + " will pay " + amount.toString() + " rupees to " + debtorName.toString())
    return creditorName.toString() + " will pay " + amount.toString() + " rupees to " + debtorName.toString()
}




 expense = {'food': {'bill': 250, 'payments': {'1': 20, '2': 32, '3': 43, '4': 35, '5': 65, '6': 12, '7': 43}},
               'rent': {'bill': 2492, 'payments': {'1': 902, '2': 98, '3': 84, '4': 35, '5': 32, '6': 552, '7': 789}},
               'vadapav': {'bill': 70, 'payments': {'1': 10, '2': 10, '3': 10, '4': 10, '5': 10, '6': 10, '7': 10}},
               'samosa': {'bill': 110, 'payments': {'1': 15, '2': 15, '3': 5, '4': 20, '5': 15, '6': 25, '7': 15}},
               'pizza': {'bill': 1700, 'payments': {'1': 50, '2': 150, '3': 200, '4': 250, '5': 300, '6': 350, '7': 400}}}
expense =  {'food': {'bill': 250, 'payments': {'1': 20, '2': 32, '3': 43, '4': 35, '5': 65, '6': 12, '7': 43}},
               'rent': {'bill': 2492, 'payments': {'1': 902, '2': 98, '3': 84, '4': 35, '5': 32, '6': 552, '7': 789}},
               'vadapav': {'bill': 70, 'payments': {'1': 10, '2': 10, '3': 10, '4': 10, '5': 10, '6': 10, '7': 10}},
               'samosa': {'bill': 110, 'payments': {'1': 15, '2': 15, '3': 5, '4': 20, '5': 15, '6': 25, '7': 15}},
               'pizza': {'bill': 1700, 'payments': {'1': 50, '2': 150, '3': 200, '4': 250, '5': 300, '6': 350, '7': 400}}}

//let a = zipPaymentAndNames(['a', 'b', 'c'], ['12', '14', '33','12'])
//differentiateCreditorAndDebtor(a, 14)
// events = getDebtInformation(7, expense)
// console.log(events)