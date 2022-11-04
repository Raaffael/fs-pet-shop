DROP TABLE IF EXISTS pets;

CREATE TABLE pets(
    id serial,
    age INT,
    kind VARCHAR(20),
    name VARCHAR(20)
);

INSERT INTO pets (age,kind,name) VALUES (7,'rainbow','fido');
INSERT INTO pets (age,kind,name) VALUES (5,'snake','Buttons');
INSERT INTO pets (age,kind,name) VALUES (3,'dog','Snoop');
INSERT INTO pets (age,kind,name) VALUES (10,'cat','Garfield');
INSERT INTO pets (age,kind,name) VALUES (20,'dog','Marley');