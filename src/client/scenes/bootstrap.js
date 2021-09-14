const Phaser = require('phaser');
import Server from '../services/server';




export default class Bootstrap extends Phaser.Scene{

    

    constructor(){
        super('bootstrap');
        
    }



    preload(){
        this.load.image('ball','/assets/ball.png');
        this.load.image('paddle','/assets/paddlu.png'); //se lo chiamo paddle non worka
        this.load.image('newBlock','/assets/blockUnhitted.png');
        this.load.image('hitBlock','/assets/blockHitted1.png');
        this.load.image('fastPower','/assets/fast.png');
        this.load.image('slowPower','/assets/slow.png');
        this.load.image('bg','/assets/bg.bmp');
        
        //menu
        this.load.image('btn','/assets/btn.png');




        //tilemap
        this.load.image('blockUnhitted1','/assets/level/tilemap/blockUnhitted1.png');
        this.load.tilemapTiledJSON('level1','/assets/level/level1.json');
        this.load.tilemapTiledJSON('level2','/assets/level/level2.json');
        this.load.tilemapTiledJSON('level3','/assets/level/level3.json');


        this.load.html("form", "/assets/text.html");
        




    }



    init(){

         this.server = new Server(this);
     }
 
     create(){
         //console.log('prova')
         //console.log(this.server);
         
         this.background = this.add.tileSprite(0,0,2000,1500,'bg');
         
         this.scene.launch('mainMenu', this.server);
         //this.scene.launch('game',this.server);
         //this.scene.launch('create_join',this.server);
         //this.scene.launch('joinroom',this.server);
         //this.scene.launch('createroom',this.server);


     }
     update () {
        this.background.tilePositionY  -=1;
     }


}