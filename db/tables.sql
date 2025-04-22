-- Users entity relationships
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, -- Auto-incrementing unique ID
    email VARCHAR(255) UNIQUE NOT NULL, -- Email remains unique
    verified_name VARCHAR(255) NOT NULL, -- Name obtained from google auth
    display_name VARCHAR(255), -- Display name for the user
    profile_pic INTEGER, -- Profile picture ID
    bio TEXT,
    hobby1_rating INTEGER,
    hobby2_rating INTEGER,
    hobby3_rating INTEGER,
    hobby4_rating INTEGER,
    hobby5_rating INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of account creation
);

-- Recommendations are converted to friendship requests
CREATE TABLE friendship_request (
    sender_id INTEGER NOT NULL REFERENCES users(user_id), -- User who sent the request
    receiver_id INTEGER NOT NULL REFERENCES users(user_id), -- User who received the request
    PRIMARY KEY (sender_id, receiver_id),
    similarity_score FLOAT, -- Similarity score between the two users
    recommendation_status INTEGER NOT NULL CHECK (recommendation_status IN (0, 1, 2)), -- 0: pending, 1: accepted(and converted to a request), 2: rejected
    status INTEGER NOT NULL CHECK (status IN (0, 1, 2)), -- 0: pending, 1: accepted, 2: rejected
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of the request
);

CREATE TABLE friendship (
    friendship_id SERIAL PRIMARY KEY, -- Auto-incrementing unique ID
    user1_id INTEGER NOT NULL REFERENCES users(user_id), -- One user in the friendship
    user2_id INTEGER NOT NULL REFERENCES users(user_id), -- The other user in the friendship
    user1_blocking_status INTEGER NOT NULL CHECK (user1_blocking_status IN (0, 1)), -- 0: user2 not blocked, 1: user2 blocked
    user2_blocking_status INTEGER NOT NULL CHECK (user2_blocking_status IN (0, 1)), -- 0: user1 not blocked, 1: user1 blocked
    user1_identity_reveal_status INTEGER NOT NULL CHECK (user1_identity_reveal_status IN (0, 1, 2)), -- 0: not revealed, 1: revealed, 2: requested by user2
    user2_identity_reveal_status INTEGER NOT NULL CHECK (user2_identity_reveal_status IN (0, 1, 2)), -- 0: not revealed, 1: revealed, 2: requested by user1
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of friendship creation
);

-- Groups entity relationships
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY, -- Auto-incrementing unique ID
    group_name VARCHAR(255) NOT NULL, -- Name of the group
    hobby1_rating FLOAT,
    hobby2_rating FLOAT,
    hobby3_rating FLOAT,
    hobby4_rating FLOAT,
    hobby5_rating FLOAT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of group creation
);

CREATE TABLE group_recommendation (
    group_id INTEGER NOT NULL REFERENCES groups(group_id), -- Group ID
    user_id INTEGER NOT NULL REFERENCES users(user_id), -- User ID
    PRIMARY KEY (group_id, user_id),
    similarity_score FLOAT, -- Similarity score between the user and the group
    status INTEGER NOT NULL CHECK (status IN (0, 1, 2)), -- 0: pending, 1: accepted, 2: rejected
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of the request
);

CREATE TABLE group_membership (
    group_id INTEGER NOT NULL REFERENCES groups(group_id), -- Group ID
    user_id INTEGER NOT NULL REFERENCES users(user_id), -- User ID
    PRIMARY KEY (group_id, user_id), -- Composite primary key
    status INTEGER NOT NULL CHECK (status IN (0, 1)), -- 0: not blocked, 1: blocked
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of membership creation
);

-- Messages entity relationships
CREATE TABLE friendship_message (
    message_id SERIAL PRIMARY KEY, -- Auto-incrementing unique ID
    coversation_id INTEGER NOT NULL REFERENCES friendship(friendship_id), -- ID of the conversation
    sender_id INTEGER NOT NULL REFERENCES users(user_id), -- User who sent the message
    content TEXT NOT NULL, -- Content of the message
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the message was sent
);

CREATE TABLE group_message (
    message_id SERIAL PRIMARY KEY, -- Auto-incrementing unique ID
    group_id INTEGER NOT NULL REFERENCES groups(group_id), -- ID of the group
    sender_id INTEGER NOT NULL REFERENCES users(user_id), -- User who sent the message
    content TEXT NOT NULL, -- Content of the message
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the message was sent
);



---------------------------------------------------------------------------------------------------
DELIMITER $$

---------------------------------- Procedures for Recommendations ---------------------------------

-- get user preferences
CREATE PROCEDURE RS_GetUser(IN input_user_id INTEGER)
BEGIN
    SELECT u.user_id, u.hobby1_rating, u.hobby2_rating, u.hobby3_rating, u.hobby4_rating, u.hobby5_rating FROM users WHERE user_id = input_user_id;
END$$

-- get list of all users with their preferences
CREATE PROCEDURE RS_GetAllUsers()
BEGIN
    SELECT u.user_id, u.hobby1_rating, u.hobby2_rating, u.hobby3_rating, u.hobby4_rating, u.hobby5_rating
    FROM users u;
END$$

-- get list of all users never recommended to a user with their preferences
CREATE PROCEDURE RS_NeverRecommendedUsers(IN input_user_id INTEGER)
BEGIN
    SELECT u.user_id, u.hobby1_rating, u.hobby2_rating, u.hobby3_rating, u.hobby4_rating, u.hobby5_rating
    FROM users u
    WHERE u.user_id != input_user_id
      AND u.user_id NOT IN (
          SELECT receiver_id
          FROM friendship_request
          WHERE sender_id = input_user_id
      );
END$$

-- get list of all groups with their preferences
CREATE PROCEDURE RS_GetAllGroups()
BEGIN
    SELECT g.group_id, g.group_name, g.hobby1_rating, g.hobby2_rating, g.hobby3_rating, g.hobby4_rating, g.hobby5_rating
    FROM groups g;
END$$

-- get list of all groups never recommended to a user with their preferences
CREATE PROCEDURE RS_NeverRecommendedGroups(IN input_user_id INTEGER)
BEGIN
    SELECT g.group_id, g.group_name, g.hobby1_rating, g.hobby2_rating, g.hobby3_rating, g.hobby4_rating, g.hobby5_rating
    FROM groups g
    WHERE g.group_id NOT IN (
        SELECT group_id
        FROM group_recommendation
        WHERE user_id = input_user_id
    );
END$$

-- insert friend recommendations into friendship_request table
CREATE PROCEDURE RS_SendFriendRecommendation(IN sender_id INTEGER , IN receiver_id INTEGER , IN similarity_score FLOAT)
BEGIN 
    INSERT INTO friendship_request (sender_id, receiver_id, similarity_score, recommendation_status, status , created_at)
    VALUES (sender_id, receiver_id, similarity_score, 0, 0, CURRENT_TIMESTAMP);
END$$

-- insert group recommendations into group_recommendation table
CREATE PROCEDURE RS_GroupRecommendation(IN input_group_id INTEGER , IN input_user_id INTEGER , IN input_similarity_score FLOAT)
BEGIN 
    INSERT INTO group_recommendation (group_id, user_id, similarity_score, status )
    VALUES (input_group_id, input_user_id, input_similarity_score, 0);
END$$

DELIMITER ;
