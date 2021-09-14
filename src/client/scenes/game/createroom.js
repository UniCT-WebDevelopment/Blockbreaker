const Phaser = require('phaser');

import 'regenerator-runtime/runtime'; //se non lo metto non legge async e scoppia tutto
var timedEvent;
var label

export default class CreateRoom extends Phaser.Scene {

    constructor() {
        super('createroom');
    }

    create(Server) {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.Server = Server;
        this.Server.setMaster(this);
        const { width, height } = this.scale
        this.emitter = new Phaser.Events.EventEmitter();

        this.countdown = 5;



        this.add.text(width * 0.5, height * 0.35, 'BlockBreaker', {
            color: '#55AAA7',
            strokeThickness: 5,
            stroke: '#55AAA7',
            shadow: {
                offsetX: 3,
                offsetY: 2,
                color: '#ff0',
                fill: true

            },
            fontSize: '72px',
            //backgroundColor: '#ff0'

        })
            .setOrigin(0.5);




        const play = this.add.image(width * 0.5, height * 0.8, 'btn').setDisplaySize(250, 100);
        label = this.add.text(play.x, play.y, "Share Your Room Id")
            .setOrigin(0.5);
        //play.setTint(0x66ff7f);


        const text = this.add.image(width * 0.5, height * 0.6, 'btn').setDisplaySize(250, 100);

        // text.setTint(0x0335fc); // blu
        text.setTint(0xfcd703);

        this.nameInput = this.add.dom(text.x, text.y + 5).createFromCache("form");
        this.add.text(this.nameInput.x, this.nameInput.y - 40, 'Your Room Id:')
            .setOrigin(0.5);

        let name = this.nameInput.getChildByName("name");


        name.value = Server.getRoom().id;
        
        //this.startGame([this.Server,0]);





    }



    update() {
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.space);


        if (spaceJustPressed) {
            /*    console.log(this.Server.getGameLevel());
               this.data = [this.Server, this.Server.getGameLevel()]
                this.scene.start('game', this.data); */

        }


    }


    startGame(data) {
        console.log('ecco')
        console.dir(data);
        // Each 1000 ms call onEvent
        timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
        this.emitter.on('start', () => {
            this.scene.start('game', data);
        })

    }

    onEvent() {
        console.log('asddsadas')
        label.setText('Game Will start in:' + this.countdown);
        this.countdown--;
        if (this.countdown == 0) {
            this.emitter.emit('start');
        }
    }
}
