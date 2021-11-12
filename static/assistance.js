function getPaymentExchangeInformation(totalMembers, expense){
    console.log("Total members "+ totalMembers)
    console.log("Expense data "+ JSON.stringify(expense))
    var names = extractMembersNames(expense)
    var totalBill = calculateTotalBill(expense)
    console.log("Total bill "+ totalBill)
    var expectedContributionBillFromEachMember = calculateExpectedContributionFromEachMember(totalBill, totalMembers)
    console.log("Expected contribution from each members "+ expectedContributionBillFromEachMember)
    var totalPayFromEachMemberForEachSource = calculateTotalPaymentByEachMembers(expense, totalMembers)
    console.log("Total members payment for each source ", totalPayFromEachMemberForEachSource)
    var zippedPaymentData = zipPaymentAndNames(names, totalPayFromEachMemberForEachSource)
    console.log("Zipped payment data "+JSON.stringify(zippedPaymentData))
    var differentiatedResponse = differentiateCreditorAndDebtor(zippedPaymentData, expectedContributionBillFromEachMember)
    console.log("Differentiated response "+ JSON.stringify(differentiatedResponse))
   events = generateResolvedContributionEvents(differentiatedResponse)

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

// Need to fix this code
function generateResolvedContributionEvents(differentiatedResponse) {
    var events = []
    var creditor = differentiatedResponse['creditor']
    var debtor = differentiatedResponse['debtor']
    console.log("Creditors ", creditor)
    console.log("Debtor ", debtor)
    var creditCounter = 0
    var debtCounter = 0
    var creditorsList = Object.entries(creditor);
    var debtorsList = Object.entries(debtor);
    console.log("Creditor list ", creditorsList)
    console.log("Debtor list ", debtorsList)

    while(true){
        // Running creditorList and debtorList simultaneously, once operations on both list completed then breaking
        // this loop to avoid array index out of bound errors
        if(creditCounter > creditorsList.length - 1 && debtCounter > debtorsList.length - 1){
            break
        }
        console.log("Credit counter ", creditCounter)
        console.log("Debit counter", debtCounter)
        currentCreditor = creditorsList[creditCounter]
        currentDebtor = debtorsList[debtCounter]
        // When Credit person have less amount that debit person, then creditor pay all his amount to debtor
        if(currentCreditor[1] != 0 && int(currentCreditor[1]) < int(currentDebtor[1])){
            events.push(eventGenerator(currentCreditor[0], round(currentCreditor[1]), currentDebtor[0]))
            exchangeAmount = round(creditorsList[creditCounter][1])
            creditorsList[creditCounter][1] = 0
            debtorAmount = round(debtorsList[debtCounter][1])
            debtorsList[debtCounter][1] = round(debtorAmount - exchangeAmount)
            creditCounter = creditCounter + 1  // Increase counter to iterate to next debtor
        }
        // When debit person have less amount that credit person, then creditor will pay only amount that debtor have
        if(currentDebtor[1] != 0 && int(currentCreditor[1]) > int(currentDebtor[1])){
            events.push(eventGenerator(currentCreditor[0], round(currentDebtor[1]), currentDebtor[0]))
            exchangeAmount = round(debtorsList[debtCounter][1])
            debtorsList[debtCounter][1] = 0
            creditorAmount = round(creditorsList[creditCounter][1])
            creditorsList[creditCounter][1] = round(creditorAmount - exchangeAmount)
            debtCounter = debtCounter + 1  // Increase counter to iterate to next debtor
        }
        // When credit person and debit person have equal amount, then creditor will pay whatever he have to debtor
        if(currentDebtor[1] != 0 && currentCreditor[1] != 0 && int(currentCreditor[1]) == int(currentDebtor[1])){
            events.push(eventGenerator(currentCreditor[0], round(currentCreditor[1]), currentDebtor[0]))
            creditorsList[creditCounter][1] = 0
            debtorsList[debtCounter][1] = 0
            debtCounter = debtCounter + 1  // Increase counter to iterate to next debtor
            creditCounter = creditCounter + 1  // Increase counter to iterate to next creditor
        }
        console.log("Updated creditors list", creditorsList)
        console.log("Updated debtors list ", debtorsList)
    }
    return events
}

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

//let a = zipPaymentAndNames(['a', 'b', 'c'], ['12', '14', '33','12'])
//differentiateCreditorAndDebtor(a, 14)
events = getPaymentExchangeInformation(7, expense)
console.log(events)