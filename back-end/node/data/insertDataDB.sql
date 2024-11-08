INSERT INTO users (password, email, firstName, lastName, paymentMethod) VALUES 
    ('password123', 'johndoe@gmail.com', 'John', 'Doe', 1),
    ('securepass456', 'janesmith@gmail.com', 'Jane', 'Smith', 0),
    ('mypass789', 'alicebrown@gmail.com', 'Alice', 'Brown', 1),
    ('password234', 'bobjohnson@gmail.com', 'Bob', 'Johnson', 0),
    ('qwerty123', 'michaeljohnson@gmail.com', 'Michael', 'Johnson', 1),
    ('pAssw0rd!', 'emilywhite@gmail.com', 'Emily', 'White', 0),
    ('letmein456', 'williamjones@gmail.com', 'William', 'Jones', 1),
    ('supersecret789', 'oliviataylor@gmail.com', 'Olivia', 'Taylor', 0),
    ('mypassword101', 'danielmartin@gmail.com', 'Daniel', 'Martin', 1),
    ('password202', 'sarahlee@gmail.com', 'Sarah', 'Lee', 0),
    ('hunter3', 'jamesbrown@gmail.com', 'James', 'Brown', 1),
    ('ilovecats99', 'chloewilson@gmail.com', 'Chloe', 'Wilson', 0),
    ('helloWorld42', 'davidgarcia@gmail.com', 'David', 'Garcia', 1),
    ('baseballfan', 'sophialopez@gmail.com', 'Sophia', 'Lopez', 0);

INSERT INTO categories (name) VALUES 
    ('Roba'),
    ('Sabates'),
    ('Accesoris');

INSERT INTO cards (userId, cardName, expirationDate, cvv, cardNumber) VALUES 
    (1, 'John Doe', '12/25', 123, '1111222233334444'),
    (3, 'Alice Brown', '12/26', 789, '9999000011112222'),
    (5, 'Michael Johnson', '11/27', 321, '5555666677778888'),
    (7, 'William Jones', '08/26', 654, '4444555566667777'),
    (9, 'Daniel Martin', '05/28', 987, '3333444455556666'),
    (11, 'James Brown', '03/29', 213, '2222333344445555'),
    (13, 'David Garcia', '09/30', 432, '1111222233334445');

INSERT INTO products (categoryId, name, description, size, price, imagePath, color, stock, activated) VALUES 
    (1, 'Samarreta Bàsica', 'Samarreta de cotó suau, ideal per al dia a dia. Ofereix una gran comoditat i un disseny senzill que combina amb tot tipus de roba casual.', 'M', 15.99, 'assets/samarreta_basica.jpg', 'Blanc', 100, 1),
    (1, 'Pantalons Texans', 'Pantalons de mezclilla clàssics amb tall modern i estil atemporal. Perfectes per a qualsevol ocasió, amb una gran resistència i un ajust còmode.', '32', 49.99, 'assets/pantalons_texans.jpg', 'Blau', 50, 1),
    (1, 'Dessuatadora amb Caputxa', 'Dessuatadora unisex amb caputxa, feta de material lleuger però càlid. Ideal per a les tardes fresques, ofereix un estil esportiu i desenfadat.', 'L', 29.99, 'assets/dessuatadora.jpg', 'Gris', 75, 1),
    (2, 'Sabatilles Esportives', 'Sabatilles esportives lleugeres i còmodes, dissenyades per a activitats físiques o ús diari. Proporcionen un bon suport al peu i un estil modern.', '42', 59.99, 'assets/sabatilles.jpg', 'Vermell', 30, 1),
    (2, 'Botes de Cuir', 'Botes elegants fabricades en cuir de gran qualitat, amb un disseny clàssic que combina amb roba formal o casual. Duradores i còmodes per a tot el dia.', '40', 89.99, 'assets/botes_cuir.jpg', 'Marró', 20, 1),
    (2, 'Sandàlies', 'Sandàlies lleugeres i fresques, perfectes per a l’estiu. Dissenyades amb corretges ajustables per garantir un bon ajust i comoditat durant llargues caminades.', '39', 19.99, 'assets/sandalies.jpg', 'Beix', 60, 1),
    (3, 'Bossa de Mà', 'Bossa de mà de cuir sintètic amb gran capacitat per a ús diari. Combina funcionalitat i estil, amb múltiples compartiments per organitzar els teus objectes personals.', NULL, 45.99, 'assets/bossa.jpg', 'Negre', 40, 1),
    (3, 'Gorra', 'Gorra ajustable de cotó amb disseny casual i esportiu. Ideal per protegir-se del sol o per complementar un look desenfadat.', NULL, 12.99, 'assets/gorra.jpg', 'Blau', 120, 1),
    (3, 'Bufanda de Llana', 'Bufanda càlida de llana natural, perfecta per als dies freds. Suau al tacte i disponible en diferents colors elegants per combinar amb qualsevol abric.', NULL, 24.99, 'assets/bufanda.jpg', 'Gris', 50, 1),
    (1, 'Camisa de Lli', 'Camisa de lli lleugera i fresca, perfecta per als dies d’estiu. Elegant i fàcil de combinar amb uns texans o pantalons curts.', 'L', 29.99, 'assets/camisa_lli.jpg', 'Blanc', 40, 1),
    (1, 'Jersei de Llana', 'Jersei de llana càlid per als dies d’hivern. Ofereix una gran comoditat i manté la calor.', 'M', 39.99, 'assets/jersei_llana.jpg', 'Verd', 35, 1),
    (2, 'Mocassins de Pell', 'Mocassins elegants i còmodes de pell per a ocasions formals o casuals.', '43', 79.99, 'assets/mocassins.jpg', 'Negre', 25, 1),
    (2, 'Botes per aigua', 'Botes impermeables per a dies de pluja. Disseny pràctic i durador.', '38', 49.99, 'assets/botes_aigua.jpg', 'Verd', 20, 1),
    (3, 'Cinturó de Cuir', 'Cinturó clàssic de cuir amb sivella metàl·lica. Complementa el teu look formal o casual.', NULL, 19.99, 'assets/cinturo.jpg', 'Negre', 75, 1),
    (3, 'Mochila Urbana', 'Mochila amb espai per a portàtil i múltiples compartiments, ideal per a la feina o estudis.', NULL, 55.99, 'assets/mochila.jpg', 'Gris', 30, 1);


INSERT INTO orders (total, userId, status, pay, dateStart, dateReady, dateEnd) VALUES 
    (75.98, 1, 'Entregat', 1, '2023-01-01 10:00:00', '2023-01-02 15:30:00', '2023-01-03 09:00:00'),
    (89.99, 2, 'Preparant', 0, '2023-02-01 14:00:00', NULL, NULL),
    (70.98, 3, 'Pendent de confirmació', 1, '2023-03-01 08:30:00', NULL, NULL),
    (28.98, 1, 'Llest per recollir', 1, '2023-04-01 12:00:00', '2023-04-02 11:30:00', NULL),
    (89.99, 2, 'Cancel·lat', 0, '2023-05-01 09:00:00', NULL, '2023-05-02 16:00:00'),
    (24.99, 3, 'Entregat', 1, '2023-06-01 07:00:00', '2023-06-02 13:00:00', '2023-06-03 10:00:00'),
    (19.99, 1, 'Preparant', 1, '2023-07-01 10:30:00', NULL, NULL),
    (89.98, 4, 'Llest per recollir', 0, '2023-08-01 09:30:00', '2023-08-02 12:00:00', NULL);


INSERT INTO orderlines (orderID, productId, productCategory, productName, productDescription, productSize, productPrice, productImagePath, productColor) VALUES
    (1, 1, 1, 'Samarreta Bàsica', 'Samarreta de cotó suau, ideal per al dia a dia. Ofereix una gran comoditat i un disseny senzill que combina amb tot tipus de roba casual.', 'M', 15.99, 'assets/samarreta_basica.jpg', 'Blanc'),
    (1, 4, 2, 'Sabatilles Esportives', 'Sabatilles esportives lleugeres i còmodes, dissenyades per a activitats físiques o ús diari. Proporcionen un bon suport al peu i un estil modern.', '42', 59.99, 'assets/sabatilles.jpg', 'Vermell'),
    (2, 5, 2, 'Botes de Cuir', 'Botes elegants fabricades en cuir de gran qualitat, amb un disseny clàssic que combina amb roba formal o casual. Duradores i còmodes per a tot el dia.', '40', 89.99, 'assets/botes_cuir.jpg', 'Marró'),
    (3, 7, 3, 'Bossa de Mà', 'Bossa de mà de cuir sintètic amb gran capacitat per a ús diari. Combina funcionalitat i estil, amb múltiples compartiments per organitzar els teus objectes personals.', NULL, 45.99, 'assets/bossa.jpg', 'Negre'),
    (3, 9, 3, 'Bufanda de Llana', 'Bufanda càlida de llana natural, perfecta per als dies freds. Suau al tacte i disponible en diferents colors elegants per combinar amb qualsevol abric.', NULL, 24.99, 'assets/bufanda.jpg', 'Gris'),
    (4, 1, 1, 'Samarreta Bàsica', 'Samarreta de cotó suau, ideal per al dia a dia. Ofereix una gran comoditat i un disseny senzill que combina amb tot tipus de roba casual.', 'M', 15.99, 'assets/samarreta_basica.jpg', 'Blanc'),
    (4, 8, 3, 'Gorra', 'Gorra ajustable de cotó amb disseny casual i esportiu. Ideal per protegir-se del sol o per complementar un look desenfadat.', NULL, 12.99, 'assets/gorra.jpg', 'Blau'),
    (5, 5, 2, 'Botes de Cuir', 'Botes elegants fabricades en cuir de gran qualitat, amb un disseny clàssic que combina amb roba formal o casual. Duradores i còmodes per a tot el dia.', '40', 89.99, 'assets/botes_cuir.jpg', 'Marró'),
    (6, 9, 3, 'Bufanda de Llana', 'Bufanda càlida de llana natural, perfecta per als dies freds. Suau al tacte i disponible en diferents colors elegants per combinar amb qualsevol abric.', NULL, 24.99, 'assets/bufanda.jpg', 'Gris'),
    (7, 14, 3, 'Cinturó de Cuir', 'Cinturó clàssic de cuir amb sivella metàl·lica. Complementa el teu look formal o casual.', NULL, 19.99, 'assets/cinturo.jpg', 'Negre'),
    (8, 13, 2, 'Botes d’aigua', 'Botes impermeables per a dies de pluja. Disseny pràctic i durador.', '38', 49.99, 'assets/botes_aigua.jpg', 'Verd'),
    (8, 11, 1, 'Jersei de Llana', 'Jersei de llana càlid per als dies d’hivern. Ofereix una gran comoditat i manté la calor.', 'M', 39.99, 'assets/jersei_llana.jpg', 'Verd');