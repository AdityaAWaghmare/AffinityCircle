from psycopg2 import DatabaseError, OperationalError

def send_friend_recommendations_to_db(connection_pool, user_id, recommended_id_similarity_scores):
    '''
    Write friend recommendations to the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn()  # Get a connection from the pool
        with conn.cursor() as cursor:
            for recommended_id, similarity_score in recommended_id_similarity_scores:
                cursor.execute(
                    "SELECT RS_SendFriendRecommendation(%s, %s, %s)",
                    (user_id, recommended_id, similarity_score)
                )
            conn.commit()
        return True
    except (DatabaseError, OperationalError) as e:
        print("Error writing friend recommendations to the database:", e)
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            connection_pool.putconn(conn)

def send_group_recommendations_to_db(connection_pool, user_id, recommended_group_id_similarity_scores):
    '''
    Write group recommendations to the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn() # Get a connection from the pool
        with conn.cursor() as cursor:
            for recommended_group_id, similarity_score in recommended_group_id_similarity_scores:
                cursor.execute(
                    "SELECT RS_SendGroupRecommendation(%s, %s, %s)", 
                    (recommended_group_id, user_id, similarity_score)
                )
            conn.commit()
        return True
    except (DatabaseError, OperationalError) as e:
        print("Error writing group recommendations to the database:", e)
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            connection_pool.putconn(conn)

def insert_new_group(connection_pool, group_name, hobby_rating_list):
    '''
    Insert a new group into the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn() # Get a connection from the pool
        with conn.cursor() as cursor:
            cursor.execute("SELECT RS_CreateGroup(%s, %s)", (group_name, hobby_rating_list))
            conn.commit()
        return True
    except (DatabaseError, OperationalError) as e:
        print("Error inserting new group into the database:", e)
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            connection_pool.putconn(conn)