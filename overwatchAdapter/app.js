import express from "express"
import PlayerController from "./src/controller/PlayerController.js";

const app= express();
const PORT = 8081;

app.use(express.json());

app.get('/api/players/search/:query', PlayerController.searchPlayer);
app.get('/api/players/summary/:playerId', PlayerController.summary);
app.get('/api/players/stats/summary/:playerId', PlayerController.stats);

app.listen(PORT, ()=>{
    console.log(`Server running un port ${PORT}`)
})