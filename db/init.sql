--------------------------------------- Initializing tables ------------------------------------------

-- Users entity relationships
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, -- Auto-incrementing unique ID
    email VARCHAR(255) UNIQUE NOT NULL, -- Email remains unique
    verified_name VARCHAR(255) NOT NULL, -- Name obtained from google auth
    display_name VARCHAR(255), -- Display name for the user
    bio TEXT,
    hobby_rating INTEGER[5], -- Array of hobby ratings
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of account creation
);

-- Recommendations are converted to friendship requests
CREATE TABLE friendship_request (
    sender_id INTEGER NOT NULL REFERENCES users(user_id), -- User who sent the request
    receiver_id INTEGER NOT NULL REFERENCES users(user_id), -- User who received the request
    PRIMARY KEY (sender_id, receiver_id),
    similarity_score REAL, -- Similarity score between the two users
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
    hobby_rating REAL[5],
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of group creation
);

CREATE TABLE group_recommendation (
    group_id INTEGER NOT NULL REFERENCES groups(group_id), -- Group ID
    user_id INTEGER NOT NULL REFERENCES users(user_id), -- User ID
    PRIMARY KEY (group_id, user_id),
    similarity_score REAL, -- Similarity score between the user and the group
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
    conversation_id INTEGER NOT NULL REFERENCES friendship(friendship_id), -- ID of the conversation
    sender_id INTEGER NOT NULL REFERENCES users(user_id), -- User who sent the message
    content TEXT NOT NULL, -- Content of the message
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the message was sent
);

CREATE TABLE group_message (
    message_id SERIAL PRIMARY KEY, -- Auto-incrementing unique ID
    group_id INTEGER NOT NULL REFERENCES groups(group_id), -- ID of the group
    sender_id INTEGER NOT NULL REFERENCES users(user_id), -- User who sent the message
    sender_display_name VARCHAR(255) NOT NULL, -- Display name of the sender
    content TEXT NOT NULL, -- Content of the message
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the message was sent
);




---------------------------------- Procedures for Recommendations ---------------------------------

-- get user preferences
CREATE OR REPLACE FUNCTION RS_GetUser(input_user_id INTEGER)
RETURNS TABLE (
    user_id INTEGER,
    hobby_rating INTEGER[5]
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.hobby_rating
    FROM users u
    WHERE u.user_id = input_user_id;
END;
$$ LANGUAGE plpgsql;

-- get list of all users with their preferences
CREATE OR REPLACE FUNCTION RS_GetAllUsers()
RETURNS TABLE (
    user_id INTEGER,
    hobby_rating INTEGER[5]
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.hobby_rating
    FROM users u;
END;
$$ LANGUAGE plpgsql;

-- get list of all users never recommended to a user with their preferences
CREATE OR REPLACE FUNCTION RS_NeverRecommendedUsers(input_user_id INTEGER)
RETURNS TABLE (
    user_id INTEGER,
    hobby_rating INTEGER[5]
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.hobby_rating
    FROM users u
    WHERE u.user_id != input_user_id
      AND u.user_id NOT IN (
          SELECT receiver_id
          FROM friendship_request
          WHERE sender_id = input_user_id
          UNION
          SELECT sender_id
          FROM friendship_request
          WHERE receiver_id = input_user_id
      );
END;
$$ LANGUAGE plpgsql;

-- get list of all groups with their preferences
CREATE OR REPLACE FUNCTION RS_GetAllGroups()
RETURNS TABLE (
    group_id INTEGER,
    hobby_rating REAL[5]
) AS $$
BEGIN
    RETURN QUERY
    SELECT g.group_id, g.hobby_rating
    FROM groups g;
END;
$$ LANGUAGE plpgsql;

-- get list of all groups never recommended to a user with their preferences
CREATE OR REPLACE FUNCTION RS_NeverRecommendedGroups(input_user_id INTEGER)
RETURNS TABLE (
    group_id INTEGER,
    hobby_rating REAL[5]
) AS $$
BEGIN
    RETURN QUERY
    SELECT g.group_id, g.hobby_rating
    FROM groups g
    WHERE g.group_id NOT IN (
        SELECT gr.group_id
        FROM group_recommendation gr
        WHERE gr.user_id = input_user_id
    );
END;
$$ LANGUAGE plpgsql;

-- insert friend recommendations into friendship_request table
CREATE OR REPLACE FUNCTION RS_SendFriendRecommendation(input_sender_id INTEGER, input_receiver_id INTEGER, input_similarity_score REAL)
RETURNS VOID AS $$
BEGIN
    INSERT INTO friendship_request (sender_id, receiver_id, similarity_score, recommendation_status, status)
    VALUES (input_sender_id, input_receiver_id, input_similarity_score, 0, 0);
END;
$$ LANGUAGE plpgsql;

-- insert group recommendations into group_recommendation table
CREATE OR REPLACE FUNCTION RS_SendGroupRecommendation(input_group_id INTEGER, input_user_id INTEGER, input_similarity_score REAL)
RETURNS VOID AS $$
BEGIN
    INSERT INTO group_recommendation (group_id, user_id, similarity_score, status)
    VALUES (input_group_id, input_user_id, input_similarity_score, 0);
END;
$$ LANGUAGE plpgsql;

-- insert new group into groups table
CREATE OR REPLACE FUNCTION RS_CreateGroup(input_group_name VARCHAR, input_hobby_rating REAL[5])
RETURNS VOID AS $$
BEGIN
    INSERT INTO groups (group_name, hobby_rating)
    VALUES (input_group_name, input_hobby_rating);
END;
$$ LANGUAGE plpgsql;

---------------------------------------------- Server functions --------------------------------------




----------------------------------------------- EXAMPLES -------------------------------------------------

-- INSERT INTO users (email, verified_name, display_name, bio, hobby_rating)
-- VALUES
-- ('a@iith.ac.in' , 'ico_A' , 'A' , 'bio_A' , '{4 , 5 , 7 , 3 , 1}'),
-- ('b@iith.ac.in' , 'ico_B' , 'B' , 'bio_B' , '{3 , 4 , 5 , 2 , 1}'),
-- ('c@iith.ac.in' , 'ico_C' , 'C' , 'bio_C' , '{2 , 3 , 4 , 1 , 1}'),
-- ('d@iith.ac.in' , 'ico_D' , 'D' , 'bio_D' , '{10 , 9 , 1 , 10 , 10}'),
-- ('e@iith.ac.in' , 'ico_E' , 'E' , 'bio_E' , '{1 , 2 , 3 , 4 , 5}'),
-- ('f@iith.ac.in' , 'ico_F' , 'F' , 'bio_F' , '{10 , 3 , 4 , 5 , 6}'),
-- ('g@iith.ac.in' , 'ico_G' , 'G' , 'bio_G' , '{10 , 2 , 3 , 4 , 5}')
-- ;

INSERT INTO groups (group_name, hobby_rating)
VALUES
('Fitness' , '{10 , 0 , 0 , 0 , 0}'),
('Music' , '{0 , 10 , 0 , 0 , 0}'),
('Study habits' , '{0 , 0 , 10 , 0 , 0}'),
('Animal interest' , '{0 , 0 , 0 , 10 , 0}'),
('Languages' , '{0 , 0 , 0 , 0 , 10}') 
;