import psycopg2

conn = psycopg2.connect(
    dbname="claims_validation_db",
    user="postgres",
    password="Mrun@postgres",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

carc_data = [
    ("1",   "Deductible amount",                                 "eligibility"),
    ("4",   "Procedure code inconsistent with modifier",         "coding"),
    ("5",   "Procedure code inconsistent with place of service", "coding"),
    ("6",   "Procedure inconsistent with patient age",           "eligibility"),
    ("16",  "Missing information required for adjudication",     "documentation"),
    ("18",  "Exact duplicate claim",                             "duplicate"),
    ("22",  "Coordination of benefits",                          "eligibility"),
    ("29",  "Filing time limit expired",                         "timely_filing"),
    ("50",  "Not medically necessary",                           "medical_necessity"),
    ("96",  "Non-covered charge",                                "coverage"),
    ("97",  "Bundled service",                                   "bundling"),
    ("109", "Claim not covered by this payer",                   "coverage"),
    ("151", "Documentation does not support level of service",   "documentation"),
    ("167", "Diagnosis not covered",                             "coding"),
    ("197", "Prior authorization absent",                        "prior_auth"),
]

for row in carc_data:
    cur.execute(
        "INSERT INTO carc_codes VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
        row
    )

conn.commit()
cur.close()
conn.close()
print(f"Done! {len(carc_data)} CARC codes loaded successfully.")