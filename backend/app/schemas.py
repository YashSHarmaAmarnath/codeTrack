from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str
    leet_code: Optional[str] = None
    codeforces: Optional[str] = None
    codechef: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id:int
    username: str
    full_name: str

    class Config:
        from_attributes = True
        
class ProblemSchema(BaseModel):
    id:int
    name: str
    link: Optional[str]
    difficulty: Optional[str]
    solution:Optional[str]
    class Config:
        from_attributes =True

class CompanyProblemSchema(BaseModel):
    id: int
    problem_link: str
    problem_name: str
    company_name: str
    num_occur: Optional[int]
    class Config:
        from_attributes = True