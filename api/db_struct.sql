CREATE TABLE post(
    post_id serial PRIMARY KEY,
    user_name varchar,
    title text,
    content text
);

CREATE TABLE users(
    user_name varchar PRIMARY KEY,
    password bytea,
    salt bytea 
);