const colyseus = require('colyseus');
const { BlockBreakerState } = require('./schema/blockbreakerstate');


exports.BlockBreakerRoom = class extends colyseus.Room {

  onCreate(options) {
    this.setState(new BlockBreakerState());
    this.maxClients = 2;

    /*       this.onMessage("type", (client, message) => {
            //
            // handle "type" message.
            //
          }); */
    this.onMessage("powerUp", (client, message) => {
      // broadcast a message to all clients
      console.log("broadcast ", "m: " + message, " c:" + client.sessionId);
      this.broadcast("powerUp", message, { except: client });

    });

    this.onMessage("level", (client, message) => {
      // broadcast a message to all clients
      //console.log("broadcast ", "m: "+ message , " c:" + client.sessionId);
      client.send("level", this.state.level);

    })


    this.onMessage("end", (client, message) => {
      // sends "fire" event to every client, except the one who triggered it.
     // console.log("broadcast ", "m: " + message, " c:" + client.sessionId);
      this.broadcast("end", message, { except: client });

    });
  }

  onJoin(client, options) {
    //console.log(client.sessionId, "joined!");
    if (this.hasReachedMaxClients()) {
      this.state.state = 'full';

    }

  }

  onLeave(client, consented) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}