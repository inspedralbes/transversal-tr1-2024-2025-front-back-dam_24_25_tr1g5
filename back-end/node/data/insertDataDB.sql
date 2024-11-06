INSERT INTO users (password, email, firstName, lastName, paymentMethod) VALUES 
    ('password123', 'johndoe@gmail.com', 'John', 'Doe', 1),
    ('securepass456', 'janesmith@gmail.com', 'Jane', 'Smith', 0),
    ('mypass789', 'alicebrown@gmail.com', 'Alice', 'Brown', 1),
    ('password234', 'bobjohnson@gmail.com', 'Bob', 'Johnson', 0);

INSERT INTO categories (name) VALUES 
    ('Roba'),
    ('Sabates'),
    ('Accesoris');

INSERT INTO cards (userId, cardName, expirationDate, cvv, cardNumber) VALUES 
    (1, 'John Doe', '12/25', 123, '1111222233334444'),
    (3, 'Alice Brown', '12/26', 789, '9999000011112222');

INSERT INTO products (categoryId, name, description, size, price, imagePath, color, stock, activated) VALUES 
    (1, 'Samarreta Bàsica', 'Samarreta de cotó suau, ideal per al dia a dia. Ofereix una gran comoditat i un disseny senzill que combina amb tot tipus de roba casual.', 'M', 15.99, 'assets/samarreta_basica.jpg', 'Blanc', 100, 1),
    (1, 'Pantalons Texans', 'Pantalons de mezclilla clàssics amb tall modern i estil atemporal. Perfectes per a qualsevol ocasió, amb una gran resistència i un ajust còmode.', '32', 49.99, 'assets/pantalons_texans.jpg', 'Blau', 50, 1),
    (1, 'Dessuatadora amb Caputxa', 'Dessuatadora unisex amb caputxa, feta de material lleuger però càlid. Ideal per a les tardes fresques, ofereix un estil esportiu i desenfadat.', 'L', 29.99, 'assets/dessuatadora.jpg', 'Gris', 75, 1),
    (2, 'Sabatilles Esportives', 'Sabatilles esportives lleugeres i còmodes, dissenyades per a activitats físiques o ús diari. Proporcionen un bon suport al peu i un estil modern.', '42', 59.99, 'assets/sabatilles.jpg', 'Vermell', 30, 1),
    (2, 'Botes de Cuir', 'Botes elegants fabricades en cuir de gran qualitat, amb un disseny clàssic que combina amb roba formal o casual. Duradores i còmodes per a tot el dia.', '40', 89.99, 'assets/botes_cuir.jpg', 'Marró', 20, 1),
    (2, 'Sandàlies', 'Sandàlies lleugeres i fresques, perfectes per a l’estiu. Dissenyades amb corretges ajustables per garantir un bon ajust i comoditat durant llargues caminades.', '39', 19.99, 'assets/sandalies.jpg', 'Beix', 60, 1),
    (3, 'Bossa de Mà', 'Bossa de mà de cuir sintètic amb gran capacitat per a ús diari. Combina funcionalitat i estil, amb múltiples compartiments per organitzar els teus objectes personals.', NULL, 45.99, 'assets/bossa.jpg', 'Negre', 40, 1),
    (3, 'Gorra', 'Gorra ajustable de cotó amb disseny casual i esportiu. Ideal per protegir-se del sol o per complementar un look desenfadat.', NULL, 12.99, 'assets/gorra.jpg', 'Blau', 120, 1),
    (3, 'Bufanda de Llana', 'Bufanda càlida de llana natural, perfecta per als dies freds. Suau al tacte i disponible en diferents colors elegants per combinar amb qualsevol abric.', NULL, 24.99, 'assets/bufanda.jpg', 'Gris', 50, 1);

INSERT INTO orders (total, userId, status, pay) VALUES 
    (75.98, 1, 'Entregat', 1),
    (89.99, 2, 'Preparant', 0),
    (70.98, 3, 'Pendent', 1);

INSERT INTO orderlines (orderID, productId, productCategory, productName, productDescription, productSize, productPrice, productImagePath, productColor) VALUES
    (1, 1, 1, 'Samarreta Bàsica', 'Samarreta de cotó suau, ideal per al dia a dia. Ofereix una gran comoditat i un disseny senzill que combina amb tot tipus de roba casual.', 'M', 15.99, 'assets/samarreta_basica.jpg', 'Blanc'),
    (1, 4, 2, 'Sabatilles Esportives', 'Sabatilles esportives lleugeres i còmodes, dissenyades per a activitats físiques o ús diari. Proporcionen un bon suport al peu i un estil modern.', '42', 59.99, 'assets/sabatilles.jpg', 'Vermell'),
    (2, 5, 2, 'Botes de Cuir', 'Botes elegants fabricades en cuir de gran qualitat, amb un disseny clàssic que combina amb roba formal o casual. Duradores i còmodes per a tot el dia.', '40', 89.99, 'assets/botes_cuir.jpg', 'Marró'),
    (3, 7, 3, 'Bossa de Mà', 'Bossa de mà de cuir sintètic amb gran capacitat per a ús diari. Combina funcionalitat i estil, amb múltiples compartiments per organitzar els teus objectes personals.', NULL, 45.99, 'assets/bossa.jpg', 'Negre'),
    (3, 9, 3, 'Bufanda de Llana', 'Bufanda càlida de llana natural, perfecta per als dies freds. Suau al tacte i disponible en diferents colors elegants per combinar amb qualsevol abric.', NULL, 24.99, 'assets/bufanda.jpg', 'Gris');