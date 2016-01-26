create table projects (
   id serial PRIMARY KEY,
   url varchar(255) NULL,
   title varchar(255) NOT NULL,
   description text NOT NULL,
   created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
