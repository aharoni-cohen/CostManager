import requests
import sys

# Prompt the user to enter a filename for the output results
filename = input("filename= ")

# --- Configuration of Microservices URLs ---
# Based on the project setup:
# a = Process A: Logs (Admin Service) -> Port 3004
# b = Process B: Users (Users Service) -> Port 3002
# c = Process C: Costs (Costs Service) -> Port 3003
# d = Process D: About (Admin Service) -> Port 3004

a = "http://localhost:3001"
b = "http://localhost:3002"
c = "http://localhost:3003"
d = "http://localhost:3004"

# Redirecting standard output to the specified file
output = open(filename, "w")
sys.stdout = output

# Printing the configuration to the output file
print("a=" + a)
print("b=" + b)
print("c=" + c)
print("d=" + d)

print()

# --- Test 1: Getting About Details (Process D) ---
print("testing getting the about")
print("-------------------------")

try:
    text = ""
    # Constructing the URL for the About service
    url = d + "/api/about/"

    # Sending GET request
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)

    # Attempting to print JSON response if available
    # print(data.json())

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# --- Test 2: Getting Monthly Report - Initial Check (Process C) ---
print("testing getting the report - 1")
print("------------------------------")

try:
    text = ""
    # Constructing the URL for the Report service
    # Checking report for user 123123, year 2026, month 1
    url = c + "/api/report/?id=123123&year=2026&month=1"

    # Sending GET request
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(text)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# --- Test 3: Adding a Cost Item (Process C) ---
print("testing adding cost item")
print("----------------------------------")

try:
    text = ""
    # Constructing the URL for adding a cost item
    url = c + "/api/add/"

    # Sending POST request with JSON payload
    data = requests.post(url, json={
        'userid': 123123,
        'description': 'milk 9',
        'category': 'food',
        'sum': 8
    })

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)

except Exception as e:
    print("problem")
    print(e)

print("")
print()

# --- Test 4: Getting Monthly Report - Verification (Process C) ---
print("testing getting the report - 2")
print("------------------------------")

try:
    text = ""
    # Requesting the report again to verify the item was added
    url = c + "/api/report/?id=123123&year=2026&month=1"

    # Sending GET request
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(text)

except Exception as e:
    print("problem")
    print(e)

print("")

