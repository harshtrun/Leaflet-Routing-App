from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, Form, status

from fastapi.middleware.cors import CORSMiddleware



def load_data():
    # Utility function to load data from db to dictionary
    try:
        from openpyxl import load_workbook
        wb = load_workbook(filename="hello_world.xlsx")
        sh1 = wb.active
    except:
        return {status.HTTP_500_INTERNAL_SERVER_ERROR}
    row = sh1.max_row
    column = sh1.max_column

    excelList = {}

    for i in range(1, row+1):
        # print(sh1.cell(i,1).value, end=" ")
        # print(sh1.cell(i, 2).value)
        excelList[sh1.cell(i, 1).value] = str(sh1.cell(i, 2).value)

    return (excelList)

def save_data(new_list):
    try:
        from openpyxl import load_workbook
        wb = load_workbook(filename="hello_world.xlsx")
        sh1 = wb.active
    except:
        return {status.HTTP_500_INTERNAL_SERVER_ERROR}

    while (sh1.max_row > 1):
        sh1.delete_rows(2)

    row = len(new_list)

    usernames = list(new_list.keys())

    for i in range(1, row+1):
        # print(sh1.cell(i,1).value, end=" ")
        # print(sh1.cell(i, 2).value)
        sh1.cell(i, 1).value = usernames[i-1]
        sh1.cell(i, 2).value = new_list[usernames[i-1]]

    wb.save("hello_world.xlsx")

    # for i in range(1, row + 1):
    #     print(sh1.cell(i,1).value, end=" ")
    #     print(sh1.cell(i, 2).value)


app = FastAPI()

my_list = load_data()



# Authorizing  CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup/")

def signup(username: str = Form(...), password: str = Form(...), reEnterPassword: str = Form(...), status_code=status.HTTP_200_OK):
    print(username, password)

    if(username in my_list):
        return {"msg": "User already exists. Please go to Login page.", "status": status.HTTP_400_BAD_REQUEST}

    elif(password!=reEnterPassword):
        return {"msg": "Both passwords don't match !!!.", "status": status.HTTP_400_BAD_REQUEST}


    else:
        my_list[username] = password
        save_data(my_list)
        return {"msg":"Signup Complete", "status":status.HTTP_200_OK}





@app.post("/login/")
async def login(username: str = Form(...), password: str = Form(...), status_code=status.HTTP_200_OK):
    print(username, password)

    if(username not in my_list):
        return {"msg":"Unknown Username", "status":status.HTTP_404_NOT_FOUND}

    if ( password == my_list[username]):
        return {"msg":f"Hello {username} . Welcome!!", "status":status.HTTP_200_OK}

    else:
        return {"msg":"Invalid credentials", "status":status.HTTP_401_UNAUTHORIZED}

# @app.get("/login/")
# def home():
#     return {"Hello": "FastAPI"}


@app.post("/update/")

def update(username: str = Form(...), password: str = Form(...), Enter_New_Password: str = Form(...)):
    if (username not in my_list):
        return {status.HTTP_404_NOT_FOUND}
    if ( password == my_list[username]):
        my_list[username] = Enter_New_Password
        save_data(my_list)
        return {status.HTTP_200_OK}
    else:
        return {status.HTTP_401_UNAUTHORIZED}


@app.post("/delete/")

def delete(username: str = Form(...), password: str = Form(...)):
    if (username not in my_list):
        return {status.HTTP_404_NOT_FOUND}
    if ( password == my_list[username]):
        del(my_list[username])
        print(my_list)
        save_data(my_list)
        return {status.HTTP_200_OK}
    else:
        return {status.HTTP_401_UNAUTHORIZED}
