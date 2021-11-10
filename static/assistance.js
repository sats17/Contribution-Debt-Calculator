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

    while(outerCounter < totalMembers){
        innerCounter = 0
        totalPaymentByEachMember = 0
        while(innerCounter < tempArrayForTotalPayment.length) {
            totalPaymentByEachMember = tempArrayForTotalPayment[innerCounter][outerCounter] + totalPaymentByEachMember
            innerCounter++
        }
        totalMembersPaymentArray.push(totalPaymentByEachMember)
        outerCounter++
    }
    console.log(totalMembersPaymentArray)
//    zippedPaymentOfEachMembers = tempArrayForTotalPayment.map((k, i) => [k, b[i]]);
//    for (let eachMemberPaymentArray in zippedPaymentOfEachMembers) {
//        console.log(eachMemberPaymentArray)
//        // Need to check how we can write code to zip [[a,b,c],[1,2,3],[x,y,z]] to [[a,1,x][b,2,y][c,3,z]]
//        // need to check how zip work in python
//    }
    return null;
}


 expense = {'food': {'bill': 250, 'payments': {'1': 20, '2': 32, '3': 43, '4': 35, '5': 65, '6': 12, '7': 43}},
               'rent': {'bill': 2492, 'payments': {'1': 902, '2': 98, '3': 84, '4': 35, '5': 32, '6': 552, '7': 789}},
               'vadapav': {'bill': 70, 'payments': {'1': 10, '2': 10, '3': 10, '4': 10, '5': 10, '6': 10, '7': 10}},
               'samosa': {'bill': 110, 'payments': {'1': 15, '2': 15, '3': 5, '4': 20, '5': 15, '6': 25, '7': 15}},
               'pizza': {'bill': 1700, 'payments': {'1': 50, '2': 150, '3': 200, '4': 250, '5': 300, '6': 350, '7': 400}}}

calculateTotalPaymentByEachMembers(expense, 6)