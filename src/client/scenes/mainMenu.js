const Phaser = require('phaser');




export default class MainMenu extends Phaser.Scene{

    
    constructor(){
        super('mainMenu'); 
        //this.cursor = this.input.keyboard.createCursorKeys()
    }

    

    

    
     create (Server)
    {
        const { width, height } = this.scale
        this.buttons = Phaser.GameObjects.Image = [];
        this.selectedButtonIndex = 0;



        console.log('create');
        
        
        
        this.cursor = this.input.keyboard.createCursorKeys()
        
        this.add.text(32, 32, 'Use: ');
        this.add.text(72, 32,'Up \nDown \nSpace ');
        this.add.text(32, 76,'To move throught Menu');
        

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

        //play Button
        const playButton = this.add.image(width*0.5, height *0.7,'btn').setDisplaySize(250,80);
        this.add.text(playButton.x, playButton.y, 'Play')
		.setOrigin(0.5);
        this.buttons.push(playButton);
        playButton.on('selected', () => {
            this.scene.pause();
            this.scene.launch('create_join', Server);
            //this.scene.setActive(false);
            //console.log(this.scene.isActive(this));
            this.scene.setVisible(false);
        })

/*         this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            console.log("event_ShutDown");
            playButton.off('selected');
        }) */



        //settingsButton
        const settingsButton = this.add.image(width*0.5, height *0.88,'btn').setDisplaySize(250,80);
        this.add.text(settingsButton.x, settingsButton.y, 'Settings')
		.setOrigin(0.5);
        this.buttons.push(settingsButton);

        settingsButton.on('selected', () => {
            //console.log('settings');
            this.scene.setVisible(false);
            this.scene.pause();
            this.scene.launch('gameOver', 'You Win');
        })

        
        

        this.selectButton(0);



    }
    init(){

      //  

    }
    
     


    update(){
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.up);
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.down);
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursor.space);
		
		if (upJustPressed)
		{
			this.selectNextButton(-1);
            console.log(this.events.listeners('selected'));
		}
		else if (downJustPressed)
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