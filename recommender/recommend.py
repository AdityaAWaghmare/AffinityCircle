import read_db
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def recommend_friends(user_id):
    '''
    Input: user
    Output: list of recommended friends
    '''

    current_user_data, other_users_data = read_db.get_never_recommended_users_from_db(user_id)
    if not current_user_data or not other_users_data:
        return []
    
    current_user_array = np.array(current_user_data)
    users_data_array = np.array(other_users_data)

    # Compute cosine similarity between the current user and all other users
    similarities = cosine_similarity(users_data_array[:, 1:], current_user_array[:, 1:])

    # Get the top N users based on similarity scores
    N = int(os.getenv("MAX_FRIENDS_RECOMMENDATIONS", 5))  # You can adjust this value as needed
    top_indices = np.argsort(similarities[0])[-N:][::-1]  # Get the indices of the top N similar users

    # Extract the user IDs of the top N similar users
    recommended_users = users_data_array[top_indices, 0].flatten().tolist()

    return recommended_users


def recommend_groups(user_id):
    '''
    Input: user
    Output: list of recommended groups
    '''

    current_user_data, group_data = read_db.get_never_recommended_groups_from_db(user_id)
    if not current_user_data or not group_data:
        return []

    current_user_array = np.array(current_user_data)
    group_data_array = np.array(group_data)

    # Compute cosine similarity between the current user and all other groups
    similarities = cosine_similarity(group_data_array[:, 1:], current_user_array[:, 1:])

    # Get the top N groups based on similarity scores
    N = int(os.getenv("MAX_GROUPS_RECOMMENDATIONS", 5))  # You can adjust this value as needed
    top_indices = np.argsort(similarities[0])[-N:][::-1]  # Get the indices of the top N similar groups

    # Extract the group IDs of the top N similar groups
    recommended_groups = group_data_array[top_indices, 0].flatten().tolist()

    return recommended_groups


def get_list_of_new_groups(max_groups, new):
    '''
    Input: None
    Output: list of new groups to be created
    '''

    users_data = read_db.get_all_users_from_db()
    groups_data = read_db.get_all_groups_from_db()
    if not users_data or not groups_data:
        return []

    users_data_array = np.array(users_data)
    groups_data_array = np.array(groups_data)

    