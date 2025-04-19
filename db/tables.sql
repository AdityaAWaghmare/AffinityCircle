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
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Timestamp of group creation
);

CREATE TABLE group_recommendation (
    group_id INTEGER NOT NULL REFERENCES groups(group_id), -- Group ID
    user_id INTEGER NOT NULL REFERENCES users(user_id), -- User ID
    PRIMARY KEY (group_id, user_id),
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