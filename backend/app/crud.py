from sqlalchemy.orm import Session
from . import models, schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        password=user.password,
        full_name=user.full_name,
        leet_code=user.leet_code if hasattr(user, 'leet_code') else None,
        codeforces=user.codeforces if hasattr(user, 'codeforces') else None,
        codechef=user.codechef if hasattr(user, 'codechef') else None,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    return db.query(models.User).filter(
        models.User.username == username,
        models.User.password == password
    ).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_problems(db: Session,offset: int = 0, limit: int = 10):
    problem = db.query(models.Problem).offset(offset).limit(limit).all()
    # problem = db.query(models.Problem).all()  # Fetch all problems without pagination
    return problem

def search_problem_by_name(db: Session, name: str):
    # return db.query(models.Problem).filter(models.Problem.name.ilike(f"%{name}%")).all()
    return db.query(models.Problem).filter(models.Problem.name.ilike(f"%{name}%")).all()

def search_company_by_problem_name(db: Session, name:str):
    return db.query(
        models.CompanyProblem.company_name,
        models.CompanyProblem.num_occur,
        ).filter(
            models.CompanyProblem.problem_name.ilike(name)
        ).all()

def search_by_company_name(db:Session, name:str,offset: int = 0, limit: int = 10):
    return  db.query(
        models.CompanyProblem.problem_link,
        models.CompanyProblem.problem_name,
        models.CompanyProblem.num_occur).filter(
            models.CompanyProblem.company_name.like(f"%{name}%")
        ).offset(offset).limit(limit).all()