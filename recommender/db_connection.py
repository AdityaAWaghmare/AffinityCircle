from psycopg2 import pool, DatabaseError, OperationalError
import os
import time

def create_connection_pool():
    '''
    Create a connection pool to the PostgreSQL database with retry logic.
    '''

    retries = 5
    for attempt in range(retries):
        try:
            connection_pool = pool.SimpleConnectionPool(
                minconn=int(os.getenv("DB_MIN_CONN", 1)),
                maxconn=int(os.getenv("DB_MAX_CONN", 10)),
                database=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST"),
                port=int(os.getenv("DB_PORT"))
            )
            if connection_pool:
                print("Connection pool initialized successfully.")
                return connection_pool
        
        except (DatabaseError, OperationalError) as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(1)  # Wait for 1 second before retrying
            else:
                print("Max retries reached. Exiting.")
                raise SystemExit("Failed to initialize database connection pool.")