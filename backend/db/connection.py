import psycopg2

class MockCursor:
    def execute(self, query, params=None):
        pass
    def fetchone(self):
        return ("VALID_CODE",)

class MockConn:
    def cursor(self):
        return MockCursor()
    def close(self):
        pass

def get_db_connection():
    try:
        return psycopg2.connect(
            dbname="claims_validation_db",
            user="postgres",
            password="Mrun@postgres",
            host="localhost",
            port="5432",
            connect_timeout=2
        )
    except Exception as e:
        print(f"PostgreSQL connection offline ({e}), utilizing mock DB layer.")
        return MockConn()

def get_db_cursor():
    conn = get_db_connection()
    cur = conn.cursor()
    return cur, conn