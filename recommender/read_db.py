from psycopg2 import DatabaseError, OperationalError

def get_never_recommended_users_from_db(connection_pool, user_id):
    '''
    Fetch users from the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(f"CALL RS_NeverRecommendedUsers({user_id})")
            users_data = cursor.fetchall()
            cursor.execute(f"CALL RS_GetUser({user_id})")
            current_user_data = cursor.fetchall()
            return current_user_data, users_data
    except (DatabaseError, OperationalError) as e:
        print("Error fetching users from the database:", e)
        return None, None
    finally:
        if conn:
            connection_pool.putconn(conn)


def get_never_recommended_groups_from_db(connection_pool, user_id):
    '''
    Fetch groups from the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(f"CALL RS_NeverRecommendedGroups({user_id})")
            group_data = cursor.fetchall()
            cursor.execute(f"CALL RS_GetUser({user_id})")
            current_user_data = cursor.fetchall()
            return current_user_data, group_data
    except (DatabaseError, OperationalError) as e:
        print("Error fetching groups from the database:", e)
        return None, None
    finally:
        if conn:
            connection_pool.putconn(conn)


def get_all_users_from_db(connection_pool):
    '''
    Fetch all users from the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute("CALL RS_GetAllUsers()")
            users_data = cursor.fetchall()
            return users_data
    except (DatabaseError, OperationalError) as e:
        print("Error fetching all users from the database:", e)
        return None
    finally:
        if conn:
            connection_pool.putconn(conn)


def get_all_groups_from_db(connection_pool):
    '''
    Fetch all groups from the database
    '''
    conn = None
    try:
        conn = connection_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute("CALL RS_GetAllGroups()")
            group_data = cursor.fetchall()
            return group_data
    except (DatabaseError, OperationalError) as e:
        print("Error fetching all groups from the database:", e)
        return None
    finally:
        if conn:
            connection_pool.putconn(conn)