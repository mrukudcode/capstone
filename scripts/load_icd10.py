import pandas as pd
import psycopg2

# Change the password below to your postgres password
conn = psycopg2.connect(
    dbname="claims_validation_db",
    user="postgres",
    password="Mrun@postgres",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

codes = []
with open(r"C:\claimguard\data\icd10cm_codes_2025.txt", "r") as f:
    for line in f:
        code = line[:7].strip()
        desc = line[7:].strip()
        if code:
            codes.append({"code": code, "description": desc})

df = pd.DataFrame(codes)
print(f"Parsed {len(df)} ICD-10 codes...")

for i, (_, row) in enumerate(df.iterrows()):
    cur.execute(
        "INSERT INTO icd10_codes (code, description) VALUES (%s, %s) ON CONFLICT DO NOTHING",
        (row["code"], row["description"])
    )
    if i % 5000 == 0:
        print(f"  Inserted {i} rows...")

conn.commit()
cur.close()
conn.close()
print("Done! All ICD-10 codes loaded successfully.")