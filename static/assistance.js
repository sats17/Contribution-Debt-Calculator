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
    totalMembersPaymentArray = []
    tempArrayForTotalPayment = []
    for (let i in expense) {
        tempPayment = []
        payments = expense[i]['payments']
        for (let names in payments){
            tempPayment.push(payments[names])
        }
        tempArrayForTotalPayment.push(tempPayment)
    }
    console.log(tempArrayForTotalPayment)
    outerCounter = 0

    while(outerCounter < totalMembers) {
        innerCounter = 0
        totalPaymentByEachMember = 0
        while(innerCounter < tempArrayForTotalPayment.length) {
            totalPaymentByEachMember = tempArrayForTotalPayment[innerCounter][outerCounter] + totalPaymentByEachMember
            innerCounter++
        }
        totalMembersPaymentArray.push(totalPaymentByEachMember)
        outerCounter++
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
    events = []
    creditor = differentiatedResponse['creditor']
    debtor = differentiatedResponse['debtor']
    console.log("Creditors ", creditor)
    console.log("Debtor ", debtor)
    creditCounter = 0
    debtCounter = 0
    creditorsList = []
    debtorsList = []
    for(let creditor in creditor.items():
        creditorsList.append(list(creditor))
    for debtor in debtor.items():
        debtorsList.append(list(debtor))

    while True:
        # Running creditorList and debtorList simultaneously, once operations on both list completed then breaking
        # this loop to avoid array index out of bound errors
        if creditCounter > len(creditorsList) - 1 and debtCounter > len(debtorsList) - 1:
            break
        print("Credit counter ", creditCounter)
        print("Debit counter", debtCounter)
        currentCreditor = creditorsList[creditCounter]
        currentDebtor = debtorsList[debtCounter]
        # When Credit person have less amount that debit person, then creditor pay all his amount to debtor
        if currentCreditor[1] != 0 and int(currentCreditor[1]) < int(currentDebtor[1]):
            events.append(eventGenerator(currentCreditor[0], roundValue(currentCreditor[1]), currentDebtor[0]))
            exchangeAmount = roundValue(creditorsList[creditCounter][1])
            creditorsList[creditCounter][1] = 0
            debtorAmount = roundValue(debtorsList[debtCounter][1])
            debtorsList[debtCounter][1] = roundValue(debtorAmount - exchangeAmount)
            creditCounter = creditCounter + 1  # Increase counter to iterate to next debtor
        # When debit person have less amount that credit person, then creditor will pay only amount that debtor have
        if currentDebtor[1] != 0 and int(currentCreditor[1]) > int(currentDebtor[1]):
            events.append(eventGenerator(currentCreditor[0], round(currentDebtor[1], 2), currentDebtor[0]))
            exchangeAmount = roundValue(debtorsList[debtCounter][1])
            debtorsList[debtCounter][1] = 0
            creditorAmount = roundValue(creditorsList[creditCounter][1])
            creditorsList[creditCounter][1] = roundValue(creditorAmount - exchangeAmount)
            debtCounter = debtCounter + 1  # Increase counter to iterate to next debtor
        # When credit person and debit person have equal amount, then creditor will pay whatever he have to debtor
        if currentDebtor[1] != 0 and currentCreditor[1] != 0 and int(currentCreditor[1]) == int(currentDebtor[1]):
            events.append(eventGenerator(currentCreditor[0], roundValue(currentCreditor[1]), currentDebtor[0]))
            creditorsList[creditCounter][1] = 0
            debtorsList[debtCounter][1] = 0
            debtCounter = debtCounter + 1  # Increase counter to iterate to next debtor
            creditCounter = creditCounter + 1  # Increase counter to iterate to next creditor
        print("Updated creditors list", creditorsList)
        print("Updated debtors list ", debtorsList)

    return events
}

 expense = {'food': {'bill': 250, 'payments': {'1': 20, '2': 32, '3': 43, '4': 35, '5': 65, '6': 12, '7': 43}},
               'rent': {'bill': 2492, 'payments': {'1': 902, '2': 98, '3': 84, '4': 35, '5': 32, '6': 552, '7': 789}},
               'vadapav': {'bill': 70, 'payments': {'1': 10, '2': 10, '3': 10, '4': 10, '5': 10, '6': 10, '7': 10}},
               'samosa': {'bill': 110, 'payments': {'1': 15, '2': 15, '3': 5, '4': 20, '5': 15, '6': 25, '7': 15}},
               'pizza': {'bill': 1700, 'payments': {'1': 50, '2': 150, '3': 200, '4': 250, '5': 300, '6': 350, '7': 400}}}

let a = zipPaymentAndNames(['a', 'b', 'c'], ['12', '14', '33','12'])
differentiateCreditorAndDebtor(a, 14)