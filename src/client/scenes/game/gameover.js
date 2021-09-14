import MainMenu from '../mainMenu';

const Phaser = require('phaser');
var text;
var timedEvent;


export default class GameOver extends Phaser.Scene {

    constructor() {
        super('gameOver');
    }

    create(txt) {
        const { width, height} = this.scale;
        this.initialTime = 150;


        this.cursor = this.input.keyboard.createCursorKeys()




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

        this.add.text(width * 0.5, height * 0.5, txt, {
            color: '#FF0000',
            strokeThickness: 5,
            stroke: '#55AAA7',
            shadow: {
                offsetX: 3,
                offsetY: 2,
                color: '#ff0000',
                fill: true

            },
            fontSize: '96px',
            //backgroundColor: '#ff0'

        })
            .setOrigin(0.5);

        //ToMainMenu Button
        const ToMainMenu = this.add.image(width * 0.5, height * 0.7, 'btn').setDisplaySize(250, 80);
        this.add.text(ToMainMenu.x, ToMainMenu.y, 'Back to Main Menu')
            .setOrigin(0.5);
        
        ToMainMenu.setTint(0x66ff7f); 






    }

    update() {


        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.space);


        if (spaceJustPressed) {
           
            this.scene.resume('mainMenu');
            this.scene.setVisible(true,'mainMenu');
            this.scene.setActive(false);
            this.scene.setVisible(false);

        }
    }

}