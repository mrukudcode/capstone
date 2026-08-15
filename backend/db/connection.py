import psycopg2

def get_db_connection():
    return psycopg2.connect(
        dbname="claims_validation_db",
        user="postgres",
        password="Mrun@postgres",
        host="localhost",
        port="5432"
    )

def get_db_cursor():
    conn = get_db_connection()
    cur = conn.cursor()
    return cur, conn