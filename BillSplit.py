"""
Here user will feed the data about bills and expenses and who paid how much for particular expense.

function name - getPaymentExchangeInformation
function return - Will return result about who have to pay whom and how much
"""


def getPaymentExchangeInformation(totalMembers, expense):
    print("Total members ", totalMembers)
    print("Expense data ", expense)
    names = extractMembersNames(expense)
    totalBill = calculateTotalBill(expense)
    print("Total bill ", totalBill)
    expectedContributionBillFromEachMember = calculateExpectedContributionFromEachMember(totalBill, totalMembers)
    print("Expected contribution from each members ", expectedContributionBillFromEachMember)
    totalPayFromEachMemberForEachSource = calculateTotalPaymentByEachMembers(expense)
    print("Total members payment for each source ", totalPayFromEachMemberForEachSource)
    zippedPaymentData = zipPaymentAndNames(names, totalPayFromEachMemberForEachSource)
    differentiatedResponse = differentiateCreditorAndDebtor(zippedPaymentData, expectedContributionBillFromEachMember)
    print("Differentiated response ", differentiatedResponse)
    events = generateResolvedContributionEvents(differentiatedResponse)

    return events


def roundValue(value):
    return round(value, 3)


def calculateTotalBill(expense):
    totalBill = 0
    for i in expense:
        totalBill = totalBill + expense[i]["bill"]
    return totalBill


def calculateExpectedContributionFromEachMember(totalBill, member):
    return roundValue(totalBill / member)


def calculateTotalPaymentByEachMembers(expense):
    totalMembersPaymentArray = []
    tempArrayForTotalPayment = []
    for i in expense:
        tempPayment = []
        payments = expense.get(i).get('payments')
        for names in payments:
            tempPayment.append(payments.get(names))
        tempArrayForTotalPayment.append(tempPayment)
    zippedPaymentOfEachMembers = zip(*tempArrayForTotalPayment)  # zip arrays present in tempArrayForTotalPayment
    for eachMemberPaymentArray in zippedPaymentOfEachMembers.__iter__():
        totalPaymentByEachMember = 0
        for payment in eachMemberPaymentArray:
            totalPaymentByEachMember = totalPaymentByEachMember + payment
        totalMembersPaymentArray.append(totalPaymentByEachMember)
    return totalMembersPaymentArray


def zipPaymentAndNames(names, payment):
    zippedData = {}
    for name, payment in zip(names, payment):
        zippedData[name] = payment
    return zippedData


def extractMembersNames(expense):
    names = []
    for i in expense:
        paymentList = expense.get(i)
        for j in paymentList.get("payments"):
            names.append(j)
        break
    return names


def differentiateCreditorAndDebtor(zippedPaymentData, expectedContributionBill):
    consolidatedResponse = {}
    creditor = {}
    debtor = {}
    even = {}
    print("zipped data ", zippedPaymentData)
    for name in zippedPaymentData:
        paymentFromMember = zippedPaymentData.get(name)
        if paymentFromMember < expectedContributionBill:
            creditor[name] = roundValue(expectedContributionBill - paymentFromMember)
        elif paymentFromMember > expectedContributionBill:
            debtor[name] = roundValue(paymentFromMember - expectedContributionBill)
        else:
            even[name] = 0
    consolidatedResponse['creditor'] = creditor
    consolidatedResponse['debtor'] = debtor
    consolidatedResponse['even'] = even
    return consolidatedResponse


def generateResolvedContributionEvents(differentiatedResponse):
    events = []
    creditor = differentiatedResponse.get('creditor')
    debtor = differentiatedResponse.get('debtor')
    print("Creditors ", creditor)
    print("Debtor ", debtor)
    creditCounter = 0
    debtCounter = 0
    creditorsList = []
    debtorsList = []
    # creating both creditor and debtor list to validate and generate events
    for creditor in creditor.items():
        print("creditor item", creditor)
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


def eventGenerator(creditorName, amount, debtorName):
    print(str(creditorName) + " will pay " + str(amount) + " rupees to " + str(debtorName))
    return str(creditorName) + " will pay " + str(amount) + " rupees to " + str(debtorName)


"""
{
 merchant: {
    "merchantBill": 123,
    "individualBills":{ "name": bill }
    },
 merchant2: {
    "totalBill": 123,
    "individualBills":{ "name": bill }
    }
}
"""


def checkValidInteger(input, isZeroNotAllowed):
    try:
        # Convert it into integer
        val = int(input)
        if val < 0:
            return False
        if isZeroNotAllowed and val == 0:
            return False
        return True
    except ValueError:
        try:
            # Convert it into float
            val = float(input)
            return True
        except ValueError:
            return False


def checkValidNames(membersCount, names):
    if len(names) != membersCount or len(set(names)) != membersCount:
        return False
    for name in names:
        if len(name) <= 0 or len(name) > 10:
            return False
    return True


def checkValidMerchantNames(names):
    for name in names:
        if len(name) <= 0 or len(name) > 10:
            return False
    return True


def main():
    print("Hello there, I am here to help you to solve your headache for contribution.")
    members = input("Tell me how many members you are there = ")
    while not checkValidInteger(members, True):
        print("What are you typing, use proper integer values.")
        members = input("Here try again = ")
    members = int(members)
    inputNames = input(
        "Okay.. now enter each of your names with comma separate[Example : Satish, Test, test] = ").strip(",")
    names = [name.strip() for name in inputNames.split(',')]
    while not checkValidNames(members, names):
        print("Rejected names, enter proper names. [Example : Satish, Test, test] =")
        inputNames = input("Here try again = ").strip(",")
        names = [name.strip() for name in inputNames.split(',')]
    print("yeah correct names ", names)
    inputMerchantNames = input(
        "Okay.. now enter merchant with comma separate[Example : Petrol, food, rent] = ").strip(",")
    merchantNames = [name.strip() for name in inputMerchantNames.split(',')]
    while not checkValidMerchantNames(merchantNames):
        print("Rejected merchant names, enter proper names. [Example : Petrol, food, rent]")
        inputMerchantNames = input("Here try again = ").strip(",")
        merchantNames = [name.strip() for name in inputMerchantNames.split(',')]
    print("Merchant nams ", merchantNames)
    print("Okay now enter payments for each following items...")
    expense = {}
    for merchant in merchantNames:
        print("Merchant is ", merchant)
        payments = {}
        total = 0
        for name in names:
            payment = input("Enter how much money paid by " + name + " = ")
            while not checkValidInteger(payment, False):
                print("What are you typing, use proper integer values.")
                payment = input("Here try again = ")
            payments[name] = float(payment)
            total = total + float(payment)
        merchantData = {"bill": total, "payments": payments}
        expense[merchant] = merchantData
    print("Expense ", expense)
    events = getPaymentExchangeInformation(members, expense)
    print("So we have resolved your contributions headache, please check below..")
    for event in events:
        print(event)


if __name__ == "__main__":
    expense = {'food': {'bill': 250, 'payments': {'1': 20, '2': 32, '3': 43, '4': 35, '5': 65, '6': 12, '7': 43}},
               'rent': {'bill': 2492, 'payments': {'1': 902, '2': 98, '3': 84, '4': 35, '5': 32, '6': 552, '7': 789}},
               'vadapav': {'bill': 70, 'payments': {'1': 10, '2': 10, '3': 10, '4': 10, '5': 10, '6': 10, '7': 10}},
               'samosa': {'bill': 110, 'payments': {'1': 15, '2': 15, '3': 5, '4': 20, '5': 15, '6': 25, '7': 15}},
               'pizza': {'bill': 1700,
                         'payments': {'1': 50, '2': 150, '3': 200, '4': 250, '5': 300, '6': 350, '7': 400}}}
    # print(calculateTotalPaymentByEachMembers(expense))
    events = getPaymentExchangeInformation(7, expense)
    print("So we have resolved your contributions headache, please check below..")
    for event in events:
        print(event)
    # main()
