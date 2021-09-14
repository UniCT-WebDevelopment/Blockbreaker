import Colyseus from "colyseus.js";
import { Client, Room } from 'colyseus.js';
import 'regenerator-runtime/runtime'; //se non lo metto non legge async e scoppia tutto
const Phaser = require('phaser');

export default class Server {

  constructor(master = Phaser.Scene) {

    this.client = new Client('ws://' + window.location.hostname + ':2567');

    //this.client = new Client('wss://0b03-95-250-98-112.ngrok.io');
    this.gameIstance = Phaser.Scene
    this.gameLevel;
    //console.log(this.client);

    this.master= master;


    


    


  }

  setMaster(master =Phaser.Scene){
    this.master= master;
  }
  getMaster(){
    return this.master;
  }


  async join() {
    this.room = await this.client.create('Room1');
    console.log(this.room.id);

    this.requestGameLevel();


  }

  async joinById(id) {
    /*     this.client.joinById(id, { }).then(room => {
          console.log("joined successfully", room);
          this.room.onMessage("level", (message) => {
            console.log("levelReceived:", message);
            this.gameLevel = message;
          });
    
        }).catch(e => {
          console.error("join error", e);
          return e;
        });
     */
    this.room = await this.client.joinById(id);

    this.requestGameLevel();

    



  }


  
  requestGameLevel() {

    this.sendMessage("level");

    this.room.onMessage("level", (message) => {
      console.log("levelReceived:", message);
      this.gameLevel = message;

    });

    this.room.onStateChange(state => {
      console.dir(state);
      console.log(state.level);
      console.log(state.state);

      if(state.state == 'full'){
       let data = [this, state.level];
       console.dir(data);
       this.master.startGame(data)
      }
      
    })
  }

  getGameLevel() {
    return this.gameLevel;
  }



  setGameIstance(game) {
    this.gameIstance = game;
    //this.client.room.send("aaa");
    //this.gameIstance.check();
    //console.log(this.room);

    this.room.onMessage('powerUp', (message) => {
      if(message == 'slow'){
        this.gameIstance.cronoTime(0.5);
      }else{
        console.log("fastReceived");
        this.gameIstance.cronoTime(1.5);
      }
      console.log(message + "  received");

    });

    this.room.onMessage('end', (message) => {
      if(message == 'Ilose'){
        this.gameIstance.endGame(1);
      }else{
        this.gameIstance.endGame(0);
      }
      
    });

  }


  sendMessage(type, msg) {
    this.room.send(type, msg);
  }

  getRoom() {
    return this.room;
  }





}