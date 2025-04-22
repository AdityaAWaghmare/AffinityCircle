from psycopg2 import pool, DatabaseError, OperationalError
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize the connection pool
try:
    connection_pool = pool.SimpleConnectionPool(
        minconn=int(os.getenv("DB_MIN_CONN", 1)),
        maxconn=int(os.getenv("DB_MAX_CONN", 10)),
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )
    if connection_pool:
        print("Connection pool initialized successfully.")
except (DatabaseError, OperationalError) as e:
    print("Error initializing connection pool:", e)
    raise SystemExit("Failed to initialize database connection pool.")

def write_friend_recommendations_to_db(user_id, recommended_id_similarity_scores):
    '''
    Write friend recommendations to the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn() # Get a connection from the pool
        with conn.cursor() as cursor:
            for recommended_id , similarity_score in recommended_id_similarity_scores:
                cursor.execute(f"CALL RS_SendFriendRecommendation({user_id}, {recommended_id}, {similarity_score})")
            conn.commit()
    except (DatabaseError, OperationalError) as e:
        print("Error writing friend recommendations to the database:", e)
        conn.rollback()
    finally:
        if conn:
            connection_pool.putconn(conn)

def write_group_recommendations_to_db(group_id, recommended_id_similarity_scores):
    '''
    Write group recommendations to the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn() # Get a connection from the pool
        with conn.cursor() as cursor:
            for recommended_id , similarity_score in recommended_id_similarity_scores:
                cursor.execute(f"CALL RS_SendGroupRecommendation({group_id}, {recommended_id}, {similarity_score})")
            conn.commit()
    except (DatabaseError, OperationalError) as e:
        print("Error writing group recommendations to the database:", e)
        conn.rollback()
    finally:
        if conn:
            connection_pool.putconn(conn)