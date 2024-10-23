import { createConnection } from 'mysql';

var connex = createConnection( {
  host: "localhost",
  user: "a23edstorcev",
  password: "InstitutPedralbes_2024",
  database: 'tr1_takeaway'
})

connex.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });