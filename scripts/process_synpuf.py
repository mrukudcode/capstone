import pandas as pd

file_path = r"C:\claimguard\data\DE1_0_2008_to_2010_Carrier_Claims_Sample_1A.csv"

print("Loading file...")
df = pd.read_csv(file_path, dtype=str)
print(f"Total rows: {len(df)}")

# Select the columns that actually exist in this file
wanted = [
    "DESYNPUF_ID",
    "CLM_ID",
    "CLM_FROM_DT",
    "CLM_THRU_DT",
    "ICD9_DGNS_CD_1",       # primary diagnosis (ICD-9 format in this dataset)
    "ICD9_DGNS_CD_2",       # secondary diagnosis
    "HCPCS_CD_1",           # procedure code
    "HCPCS_CD_2",
    "LINE_NCH_PMT_AMT_1",   # payment amount
    "PRF_PHYSN_NPI_1",      # provider NPI
]

available = [c for c in wanted if c in df.columns]
df_clean = df[available].dropna(subset=["ICD9_DGNS_CD_1", "HCPCS_CD_1"])
print(f"Rows with both diagnosis and procedure code: {len(df_clean)}")

# Take 10,000 rows
df_sample = df_clean.head(10000)

output_path = r"C:\claimguard\data\test_claims_synpuf.csv"
df_sample.to_csv(output_path, index=False)
print(f"Done! Saved {len(df_sample)} test claims to test_claims_synpuf.csv")
print(f"\nSample of first 3 rows:")
print(df_sample.head(3).to_string())