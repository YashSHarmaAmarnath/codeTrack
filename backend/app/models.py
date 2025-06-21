from sqlalchemy import Column,Integer,String
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True,index=True)
    username = Column(String,unique=True,index=True)
    password = Column(String)
    full_name = Column(String)
    leet_code = Column(String)
    codeforces = Column(String)
    codechef = Column(String)

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    link = Column(String)
    difficulty = Column(String)
    solution = Column(String)


class CompanyProblem(Base):
    __tablename__ = "companyProblem"
    id = Column(Integer, primary_key=True, index=True)
    problem_link= Column(String)
    problem_name= Column(String,index=True)
    company_name=Column(String)
    num_occur = Column(Integer)