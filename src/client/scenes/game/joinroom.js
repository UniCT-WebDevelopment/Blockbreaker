const Phaser = require('phaser');

import 'regenerator-runtime/runtime'; //se non lo metto non legge async e scoppia tutto
var timedEvent;
var label


export default class JoinRoom extends Phaser.Scene {

    constructor() {
        super('joinroom');

    }

    create(Server) {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.Server = Server;
        this.Server.setMaster(this); 
        this.buttons = Phaser.GameObjects.Image = [];
        this.selectedButtonIndex = 0;
        this.cursor = this.input.keyboard.createCursorKeys()
        this.emitter = new Phaser.Events.EventEmitter();

        this.countdown = 7;


        //const roomId = 'Your Room Id:\n\n ' + Server.getRoom().id;
        //console.log(roomId);

        const { width, height } = this.scale


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


        /* 
                const play = this.add.image(width*0.3, height *0.7,'btn').setDisplaySize(250,80);
                this.add.text(play.x, play.y, 'Play')
                .setOrigin(0.5);
                play.setTint(0x66ff7f);
         */

        const join = this.add.image(width * 0.7, height * 0.7, 'btn').setDisplaySize(250, 80);
        label = this.add.text(join.x, join.y, 'Join')
            .setOrigin(0.5);
        // text.setTint(0x0335fc); // blu
        join.setTint(0x66ff7f);
        this.buttons.push(join);
        join.on('selected', () => {

            let name = this.nameInput.getChildByName("name");
            if (name.value != "") {
                    this.JoinRoom(name.value);

            }
        });


        //this.nameInput = this.add.dom(width*0.3, height*0.72, 'input', 'width: 230px; height: 30px; placeholder="123-45-678"');


        const text = this.add.image(width * 0.3, height * 0.7, 'btn').setDisplaySize(250, 100);
        text.setTint(0xfcd703);

        this.nameInput = this.add.dom(text.x, text.y + 5).createFromCache("form");
        this.add.text(this.nameInput.x, this.nameInput.y - 40, 'Write Your RoomId')
            .setOrigin(0.5);




        const backBtn = this.add.image(width * 0.9, height * 0.9, 'btn').setDisplaySize(100, 50);
        this.add.text(backBtn.x, backBtn.y, '<= Back')
            .setOrigin(0.5);
        //backBtn.setTint(0x0335fc); // blu
        this.buttons.push(backBtn);
        backBtn.on('selected', () => {
            this.scene.start('create_join', Server);
            this.scene.setActive(false);
            this.scene.setVisible(false);

        });










    }
    async JoinRoom(id) {
        //const joined = await this.Server.joinById(name.value)

        if (this.Server.joinById(id)) {
            

        } else {

        }
    }


    update() {
        const leftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.left);
        const rightJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.right);
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.space);

        if (leftJustPressed) {
            this.selectNextButton(-1);
        }
        else if (rightJustPressed) {
            this.selectNextButton(1);
        }
        else if (spaceJustPressed) {
            this.confirmSelection();
        }

        if (this.scene.visible == false) {
            this.scene.setVisible = true;
        }

    }


    selectButton(index) {
        const currentButton = this.buttons[this.selectedButtonIndex];
        currentButton.setTint(0xFFFFFF);

        const button = this.buttons[index];
        button.setTint(0x66ff7f);
        this.selectedButtonIndex = index;


    }

    selectNextButton(change = 1) {
        let index = this.selectedButtonIndex + change;

        if (index >= this.buttons.length) {
            index = 0;
        } else if (index < 0) {
            index = this.buttons.length - 1
        }
        this.selectButton(index);
    }

    confirmSelection() {
        const button = this.buttons[this.selectedButtonIndex];

        button.emit('selected');
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
