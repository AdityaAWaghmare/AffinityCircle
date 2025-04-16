-- User table to store basic user information
CREATE TABLE user_table (
    user_id SERIAL PRIMARY KEY,
    user_actual_name TEXT,
    email_id VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User profile information
CREATE TABLE user_profile_table (
    user_id INTEGER PRIMARY KEY REFERENCES user_table(user_id) ON DELETE CASCADE,
    display_name VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT
);

-- User preferences and ratings for hobbies
CREATE TABLE user_preferences_rating (
    user_id INTEGER PRIMARY KEY REFERENCES user_table(user_id) ON DELETE CASCADE,
    hobby1_rating INTEGER,
    hobby2_rating INTEGER,
    hobby3_rating INTEGER,
    hobby4_rating INTEGER,
    hobby5_rating INTEGER,
    hobby6_rating INTEGER,
    hobby7_rating INTEGER,
    hobby8_rating INTEGER,
    hobby9_rating INTEGER,
    hobby10_rating INTEGER,
    hobby11_rating INTEGER,
    hobby12_rating INTEGER,
    hobby13_rating INTEGER,
    hobby14_rating INTEGER,
    hobby15_rating INTEGER
);

-- Block list to track blocked users/groups
CREATE TABLE block_list (
    block_id SERIAL PRIMARY KEY,
    blocker_id INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    blocked_id INTEGER NOT NULL,
    blocked_type VARCHAR(10) NOT NULL CHECK (blocked_type IN ('user', 'group')),
    UNIQUE (blocker_id, blocked_id)
);

-- Friendship tables (split into two tables as per the schema)
CREATE TABLE friendship_table1 (
    f_id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    UNIQUE (sender_id, receiver_id)
);

CREATE TABLE friendship_table2 (
    f_id INTEGER PRIMARY KEY REFERENCES friendship_table1(f_id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Identity reveals tables
CREATE TABLE identity_reveals_table1 (
    reveal_id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    UNIQUE (sender_id, receiver_id)
);

CREATE TABLE identity_reveals_table2 (
    reveal_id INTEGER PRIMARY KEY REFERENCES identity_reveals_table1(reveal_id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE
);

-- Group members (using a junction table instead of array for proper normalization)
CREATE TABLE group_members (
    group_id INTEGER NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL,
    receiver_type VARCHAR(10) NOT NULL CHECK (receiver_type IN ('user', 'group')),
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User recommendations tables (split into two tables)
CREATE TABLE user_recommendations1 (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    recommended_id INTEGER NOT NULL,
    recommended_type VARCHAR(10) NOT NULL CHECK (recommended_type IN ('user', 'group')),
    score DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_recommendations2 (
    recommendation_id INTEGER NOT NULL PRIMARY KEY REFERENCES user_recommendations1(recommendation_id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked'))
);

-- Indexes for better performance
CREATE INDEX idx_messages_receiver ON messages(receiver_id, receiver_type);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_recommendations1_user ON user_recommendations1(user_id);
CREATE INDEX idx_recommendations2_status ON user_recommendations2(status);