const Phaser = require('phaser');
import { Engine } from 'matter';
import Server from '../services/server';
import Paddle from './game/paddle';
import Power from './game/power';


var level = [
    'level1',
    'level2',
    'level3'
]

var colors = [
    0xD12525,
    0x227D75,
    0xE3DF0C
]

var timerLabel;
var timedEvent;
var lvl


export default class Game extends Phaser.Scene {


    constructor() {
        super('game');
    }




    create(data) {
        console.log('Game-------------------------------');
        //Server
        console.log(data);

        this.Server = data[0];
        this.Server.setGameIstance(this);
        this.nlvl = data[1];
        //lvl = level[Phaser.Math.Between(0,level.length-1)];
        lvl = level[this.nlvl];
        /*         console.log("nlvl : " + this.nlvl);
                console.log("lvl : " + lvl); */


        //Game Settings
        const { width, height } = this.scale;
        this.initialTime = 5;
        this.lives = 3; //numero vite

        //
        //
        //Label Zone
        timerLabel = this.add.text(20, 10, 'Countdown: ' + this.formatTime(this.initialTime));
        this.livesLaberl = this.add.text(this.scale.width - 100, 10, 'Lives: ' + this.lives);

        // Each 1000 ms call onEvent
        timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });



        console.log(lvl);
        this.cursors = this.input.keyboard.createCursorKeys()
        this.matter.resolver._restingThresh = 1;





        //Create Paddle
        this.paddle = new Paddle(this.matter.world, width * 0.5, height * 0.92, 'paddle', {
            isStatic: true,
            restitution: 1,
            chamfer: {
                radius: 60
            },

            collisionFilter: {
                category: 0x0001,
                mask: 0x0002

            }

        })
        this.paddle.setScale(0.25, 0.16);
        this.paddle.setData('type', 'paddle');

        this.paddle.setOnCollide(this.handlePaddleCollide.bind(this));




        //Create Ball
        this.ball = this.matter.add.image(width * 0.5, height * 0.92, 'ball', undefined, {
            //isStatic: true,
            restitution: 1,
            chamfer: {
                radius: 60
            },
            collisionFilter: {
                category: 0x0002,
            }
        })
        this.ball.setScale(0.2, 0.2);
        this.ball.setData('type', 'ball');
        this.ball.setBounce(1);
        const body = this.ball.body;
        this.matter.body.setInertia(body, Infinity);
        this.ball.setFriction(0, 0, 0);
        this.ball.body.setMaxVelocityY = 5;
        console.log(this.matter.world.bound);


        this.paddle.attachBall(this.ball);
        this.ball.setOnCollide(this.handleBallCollide.bind(this));



        //TileMap
        //Level
        const map = this.make.tilemap({ key: lvl })
        const tileset = map.addTilesetImage('blockUnhitted1')

        map.createLayer(lvl, tileset, 0, 0);

        this.blocks = map.createFromTiles(1, 0, { key: 'blockUnhitted1' })
            .map(go => {
                go.x += go.width * 0.5
                go.y += go.height * 0.5

                const block = this.matter.add.gameObject(go, {
                    isStatic: true,
                    restitution: 1,
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002
                    }
                })
                block.setData('type', 'block');
                block.setData('life', '2');

                //color
                block.setTint(colors[Phaser.Math.Between(0, colors.length - 1)])
                return block
            })




    }

    handlePaddleCollide(data = Phaser.Types.Physics.Matter.MatterCollisionDat) {
        const { bodyA, bodyB } = data
        if (!bodyA.gameObject) {
            return

        }

        var objB = Phaser.GameObjects.GameObject;
        objB = bodyB.gameObject;

        if (objB.getData('type') == 'power') {
            //console.log(this.paddle.getBall());
            if (!this.paddle.getBall()) {
                if (objB.getData('power') == 'fast') {

                    //Sistemare SpeedUp
                    //this.cronoTime(1.5);
                    this.Server.sendMessage("powerUp", 'fast');

                } else {
                    //this.cronoTime(0.5);
                    this.Server.sendMessage("powerUp", 'slow');
                }
            }
            objB.destroy(true);
        }

    }

    cronoTime(t) {
        this.matter.world.engine.timing.timeScale = t;
    }



    handleBallCollide(data = Phaser.Types.Physics.Matter.MatterCollisionData) {



        const { bodyA, bodyB } = data

        if (!bodyA.gameObject) {
            return
        }

        var objB = Phaser.GameObjects.GameObject;
        objB = bodyB.gameObject;

        if (objB.getData('type') !== 'block') {
            if (this.ball.x < this.paddle.x - 10) {
                //left side

                this.ball.setVelocityX(-2)

            } else if (this.ball.x > this.paddle.x + 10) {
                //right side
                this.ball.setVelocityX(2)

            } else {
                //this.ball.setVelocityX(0)

            }
            return
        }

        if (objB.getData('life') == '2') {
            objB.setTexture('hitBlock');
            objB.setData('life', '1')
        } else {
            console.log(objB.getData('life'));
            const idx = this.blocks.findIndex(block => block === objB)
            if (idx >= 0) {
                //fare metodo per distruzione blocchi?
                console.dir(objB);
                this.blocks.splice(idx, 1);
                this.spawnPower(objB.x, objB.y);
                objB.destroy(true);
            }
        }

        if (this.blocks.length <= 0) {
            this.Server.sendMessage('end', 'IWin');
            this.endGame(1);
        }
    }


    spawnPower(a, b) {


        if (Math.random() > 0.1) {

            return new Power(this.matter.world, a, b);


        }






    }

    update() {
        //controllo pos palla
        if (this.ball.y > this.scale.height + 100) {
            this.paddle.attachBall(this.ball)
            --this.lives
            this.livesLaberl.text = 'Lives: ' + this.lives
            this.matter.world.engine.timing.timeScale = 1;
            if (this.lives == 0) {
                this.Server.sendMessage('end', 'Ilose');
                this.endGame(0);
            }
            return
        }


        this.handleInput();



    }

    handleInput() {

        const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustDown) {
            this.paddle.launch()
        }
        this.paddle.update(this.cursors);

        const s = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        if (s) {
            console.log(this.ball);
        }



    }
    check() {
        console.log("CheckRiuscito");
    }


    //Timer
    formatTime(seconds) {
        // Minutes
        var minutes = Math.floor(seconds / 60);
        // Seconds
        var partInSeconds = seconds % 60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2, '0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }


    onEvent() {
        /*  this.initialTime -= 1; // One second
            timerLabel.setText('Countdown: ' + this.formatTime(this.initialTime));
            if(this.initialTime == 0){
               this.scene.start('gameOver');
                this.scene.setActive(false);
                this.scene.setVisible(false);
    
            } */


        this.initialTime += 1;
        timerLabel.setText('Countdown: ' + this.formatTime(this.initialTime));
    }


    endGame(cause = Boolean) {

        if (cause) {
            //cause == 1 =>> blocks Destroied/enemy out of live
            this.scene.start('gameOver', 'You Win');
            
        } else {

            //cause == 0 =>> out of life/enemy destroy all blocks
            this.scene.start('gameOver', 'You Lose');

        }



        this.scene.setActive(false);
        this.scene.setVisible(false);
    }

}