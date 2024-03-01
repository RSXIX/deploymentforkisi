function generateRandomLocation() {
    const longitude = (Math.random() - 0.5) * 360;
    const lattitude = (Math.random() - 0.5) * 180;
    return {longitude, lattitude};
 }
 
 function generateUnlockEvent() {
    const location = generateRandomLocation();
    const unlockEvent = {
        id: Math.floor(Math.random() * 1000),
        actor_type: 'User',
        actor_id: Math.floor(Math.random() * 1000),
        actor_name: 'John Doe',
        action: 'unlock',
        object_type: 'Lock',
        object_id: Math.floor(Math.random() * 1000),
        object_name: 'Main Entrance',
        success: true,
        error_code: null,
        error_message: null,
        created_at: new Date().toISOString(),
        references: [
            { id: Math.floor(Math.random() * 1000), type: 'Lock' },
            { id: Math.floor(Math.random() * 1000), type: 'Organization' },
            { id: Math.floor(Math.random() * 1000), type: 'Place' },
            { id: Math.floor(Math.random() * 1000), type: 'RoleAssignment' }
        ],
        location: {
            lng: location.longitude,
            lat: location.lattitude
        }
    };
    return JSON.stringify(unlockEvent);
 }
 
 
 const PORT = process.env.PORT || 3000;
 const INDEX = '/index.html';

 const server = express()
   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
   .listen(PORT, () => console.log(`Listening on ${PORT}`));
  server.on("listening", () => {
     console.log("WebSocket listening on port " + PORT);
  });

  const { Server } = require('ws');

  const wss = new Server({ server });
 
 wss.on("connection", ws => {
    console.log("Client connected!");
 
    const interval = setInterval(() => {
       const unlockEvent = generateUnlockEvent();
       ws.send(unlockEvent);
   }, 200);
 
    ws.on('close', () => {
       console.log('Client disconnected!');
       clearInterval(interval);
       ws.close(function () {
        console.log('Server closed! ');
      });
   });
 });