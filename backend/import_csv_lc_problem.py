import csv
from main import Problem, SessionLocal

def import_csv(filepath: str):
    db = SessionLocal()
    with open(filepath, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            problem = Problem(
                name=row["name"],
                link=row["link"],
                difficulty=row["difficulty"],
                solution=row["solution"]
            )
            db.add(problem)
    db.commit()
    db.close()
    print("CSV data imported successfully.")

if __name__ == "__main__":
    import_csv("C:\drive\codingPlatform\main\backend\data\leetcode_problems.csv")  # replace with your actual file name
