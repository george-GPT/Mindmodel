import psycopg2

try:
    conn = psycopg2.connect(
        dbname="mindmodel_db",
        user="future",
        password="Quant77",
        host="localhost",
        port="5432"
    )
    print("Successfully connected to PostgreSQL!")
    conn.close()
except Exception as e:
    print(f"Error connecting to PostgreSQL: {e}") 