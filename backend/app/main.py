from fastapi import FastAPI, Depends, HTTPException,status,Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm ,OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import jwt, JWTError
from contextlib import asynccontextmanager
import httpx
from . import models, schemas, crud, database
from fastapi.responses import FileResponse
import os

# from fastapi import 

SECRET_KEY = "mysecretkey"  # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
# print("jwt token url:", oauth2_scheme)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    print("Creating tables...")
    models.Base.metadata.create_all(bind=database.engin)
    print("Tables created.")
    
    yield  # App runs between startup and shutdown

    # Shutdown code (if any)
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/register/", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@app.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Create the JWT access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username},  # "sub" (subject) claim is typically the username or user ID
        expires_delta=access_token_expires
    )
    
    # Return token and basic user info
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": db_user.full_name
    }

@app.get("/user/{user_id}", response_model=schemas.UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/profile/leetcode")
async def fetch_leetcode_data(current_user: models.User = Depends(get_current_user)):
    leet_code_id = current_user.leet_code
    if not leet_code_id:
        raise HTTPException(status_code=400, detail="LeetCode ID not set for user")

    query = """
    query userCombinedData($username: String!) {
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
            badge {
                name
            }
        }
        matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
        }
    }
    """

    variables = {
        "username": leet_code_id
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://leetcode.com/graphql",
                json={"query": query, "variables": variables},
                headers={
                    "Content-Type": "application/json",
                    "Referer": "https://leetcode.com/",
                    "Origin": "https://leetcode.com",
                    "User-Agent": "Mozilla/5.0"
                }
            )
            print("Response status code:", response.status_code)
            print(response.text)
            response.raise_for_status()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"External API error: {str(e)}")

    data = response.json()
    user_data = data.get("data", {})

    return {
        "username": leet_code_id,
        "contestRanking": user_data.get("userContestRanking"),
        "submissionStats": user_data.get("matchedUser", {}).get("submitStats", {}).get("acSubmissionNum")
    }

@app.get("/profile/codeChef")
async def fetch_codechef_data(current_user: models.User = Depends(get_current_user)):
    codechef_id = current_user.codechef
    if not codechef_id:
        raise HTTPException(status_code=400, detail="Codechef ID not set for user")

    url = f"http://localhost:8800/handle/{codechef_id}"
    # url = f"https://codechef-api.vercel.app/handle/{codechef_id}"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            # data["heatMap"] =  # Set heatMap to an empty list
            return data
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=f"Error fetching CodeChef data: {exc.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
@app.get("/profile/codeforces")
async def fetch_codeforces_data(current_user: models.User = Depends(get_current_user)):
    codeforces_id = current_user.codeforces  # Assuming you've added this field to your User model
    if not codeforces_id:
        raise HTTPException(status_code=400, detail="Codeforces ID not set for user")

    try:
        async with httpx.AsyncClient() as client:
            # Fetch user.status
            status_url = f"https://codeforces.com/api/user.status?handle={codeforces_id}&from=1&count=100000"
            status_response = await client.get(status_url)
            status_response.raise_for_status()
            status_data = status_response.json()
            
            # Fetch user.info
            info_url = f"https://codeforces.com/api/user.info?handles={codeforces_id}"
            info_response = await client.get(info_url)
            info_response.raise_for_status()
            info_data = info_response.json()
            
            # Fetch user.rating
            rating_url = f"https://codeforces.com/api/user.rating?handle={codeforces_id}"
            rating_response = await client.get(rating_url)
            rating_response.raise_for_status()
            rating_data = rating_response.json()
        
        # Combine all results into a single dict
        combined_data = {
            "username": codeforces_id,
            "status": status_data,
            "info": info_data,
            "rating": rating_data
        }
        return combined_data
    
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"Error fetching Codeforces data: {exc.response.text}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    


@app.get("/problems/")
def read_problems(limit:int = Query(10,ge=1),offset:int=Query(0,ge=0)):
    db = database.SessionLocal()
    problems = crud.get_problems(db, limit=limit, offset=offset)
    if not problems:
        raise HTTPException(status_code=404,detail="No problems found")
    result = []
    for problem in problems:
        companies = crud.search_company_by_problem_name(db,problem.name)
        result.append({
            'difficulty' : problem.difficulty,
            'id' : problem.id,
            'link' : problem.link,
            'name' : problem.name,
            # 'solution': problem.solution,
            "companies": [
                {"company_name": c.company_name, "num_occur": c.num_occur} for c in companies
            ]
        })

        

    db.close()
    print(result[0])
    return result


@app.get("/problem/search")
def search_problems(name: str, db: Session = Depends(get_db)):
    problems = crud.search_problem_by_name(db,name)
    if not problems:
        raise HTTPException(status_code=404,detail="No problems found (check for spelling mistake)")
    result = []
    for problem in problems:
        companies = crud.search_company_by_problem_name(db,problem.name)
        print(companies)
        result.append({
            'difficulty' : problem.difficulty,
            'id' : problem.id,
            'link' : problem.link,
            'name' : problem.name,
            'solution': problem.solution,
            "companies": [
                {"company_name": c.company_name, "num_occur": c.num_occur} for c in companies
            ]
        })

    print(result[0])
    return result

@app.get("/problem/get_company")
def get_company(name:str,db:Session =Depends(get_db)):
    companies = crud.search_company_by_problem_name(db, name)
    return [{"company_name": c[0], "num_occur": c[1]} for c in companies]

@app.get("/problem/search_company")
def search_by_company(name:str,limit:int = Query(10,ge=1),offset:int=Query(0,ge=0),db:Session = Depends(get_db)):
    questions = crud.search_by_company_name(db,name, limit=limit, offset=offset)
    if not questions:
        raise HTTPException(status_code=404,detail="No Company found")
    return [
        {
            "problem_link": q[0],
            "problem_name": q[1],
            "num_occur": q[2]
        } for q in questions
    ]


@app.get("/download/company-csv/")
def download_company_csv(filename: str):
    file_path = os.path.join("data", "companies", filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, media_type='text/csv', filename=filename)

@app.get("/list/company-csv/")
def list_company_csv_files():
    folder_path = os.path.join("data", "companies")
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="Companies folder not found")

    files = [
        f for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f)) and f.endswith(".csv")
    ]
    return {"files": files}