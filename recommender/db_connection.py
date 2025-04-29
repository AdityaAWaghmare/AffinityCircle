from psycopg2 import pool, DatabaseError, OperationalError
import os

def create_connection_pool():
    '''
    Create a connection pool to the PostgreSQL database.
    '''
    try:
        connection_pool = pool.SimpleConnectionPool(
            minconn=int(os.getenv("DB_MIN_CONN", 1)),
            maxconn=int(os.getenv("DB_MAX_CONN", 2)),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=5432
        )
        if connection_pool:
            print("Connection pool initialized successfully.")
            return connection_pool
    
    except (DatabaseError, OperationalError) as e:
        print("Error initializing connection pool:", e)
        raise SystemExit("Failed to initialize database connection pool.")