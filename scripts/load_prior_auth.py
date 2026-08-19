import psycopg2
import json

conn = psycopg2.connect(
    dbname="claims_validation_db",
    user="postgres",
    password="Mrun@postgres",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

with open(r"C:\claimguard\data\prior_auth_rules.json") as f:
    data = json.load(f)

for rule in data["rules"]:
    cur.execute(
        "INSERT INTO prior_auth_rules (cpt_code, description, medicare_required, medicaid_required) VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING",
        (rule["cpt_code"], rule["description"], rule["medicare_required"], rule["medicaid_required"])
    )

conn.commit()
cur.close()
conn.close()
print(f"Done! {len(data['rules'])} prior auth rules loaded.")