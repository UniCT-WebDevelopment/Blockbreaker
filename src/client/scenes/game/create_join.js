const Phaser = require('phaser');
import Server from '../../services/server';
import 'regenerator-runtime/runtime'; //se non lo metto non legge async e scoppia tutto


export default class Create_Join extends Phaser.Scene {
    constructor(){
        super('create_join')
 
    }

    create(Server){
        this.Server = Server;
        console.log(Server);
        const { width, height } = this.scale
        this.buttons = Phaser.GameObjects.Image = [];
        this.selectedButtonIndex = 0;
        this.cursor = this.input.keyboard.createCursorKeys()


        this.add.text(width*0.5, height *0.35, 'BlockBreaker',{
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




        const newRoom = this.add.image(width*0.3, height *0.7,'btn').setDisplaySize(250,80);
        this.btn1_text = this.add.text(newRoom.x, newRoom.y, 'Create New Room')
		.setOrigin(0.5);
        newRoom.setTint(0x66ff7f);
        this.buttons.push(newRoom);
        newRoom.on('selected', () => {
           


          this.createRoom();  
        })





        const joinRoom = this.add.image(width*0.7, height *0.7,'btn').setDisplaySize(250,80);
        this.add.text(joinRoom.x, joinRoom.y, 'Join Room')
		.setOrigin(0.5);
        this.buttons.push(joinRoom);
        joinRoom.on('selected', () => {
            this.scene.start('joinroom',this.Server);

        })



        const backBtn = this.add.image(width * 0.9, height * 0.9, 'btn').setDisplaySize(100, 50);
        this.add.text(backBtn.x, backBtn.y, '<= Back')
            .setOrigin(0.5);
        //backBtn.setTint(0x0335fc); // blu
        this.buttons.push(backBtn);
        backBtn.on('selected', () => {
            this.scene.resume('mainMenu');
            this.scene.setVisible(true,'mainMenu');
            this.scene.setActive(false);
            this.scene.setVisible(false);

        })
        
    }

    async createRoom(){
        await this.Server.join();

        this.scene.start('createroom',this.Server);
        

        
        
    }


    update(){
        const leftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.left);
		const rightJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.right);
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.space);
		
		if (leftJustPressed)
		{
			this.selectNextButton(-1);
		}
		else if (rightJustPressed)
		{
			this.selectNextButton(1);
		}
		else if (spaceJustPressed)
		{
			this.confirmSelection();
		}

        if(this.scene.visible==false){
            this.scene.setVisible=true;
        }

    }


    selectButton(index)
	{
		const currentButton = this.buttons[this.selectedButtonIndex];
        currentButton.setTint(0xFFFFFF);

        const button = this.buttons[index];
        button.setTint(0x66ff7f);
        this.selectedButtonIndex = index;
        

	}

	selectNextButton(change = 1)
	{
		let index = this.selectedButtonIndex + change;
        
        if(index>= this.buttons.length){
            index = 0;
        } else if(index <0){
            index = this.buttons.length-1
        }
        this.selectButton(index);
	}

	confirmSelection()
	{
		const button = this.buttons[this.selectedButtonIndex];

        button.emit('selected');
	}


 

}