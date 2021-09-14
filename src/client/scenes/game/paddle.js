const Phaser = require('phaser');

export default class Paddle extends Phaser.Physics.Matter.Image{
    
    #ball = Phaser.Physics.Matter.Image;

    constructor(world, x, y, texture,config){
        super(world,x,y,texture,undefined,config);
        world.scene.add.existing(this);
        this.#ball = null;
    }

    attachBall(ball = Phaser.Physics.Matter.Image){

        //console.log(" asdasd2 " + this.#ball.getData('type') + " asdasd ");


            this.#ball = ball
            this.#ball.x= this.x
            this.#ball.y= this.y - (this.height *0.1) - (ball.height *0.1)
            this.#ball.setVelocity(0)

   
    }

    launch(){
        if(!this.#ball){
            return
        }        

        this.#ball.setVelocityY(-4);
        console.log("lancio");
        this.#ball = undefined;
    }

    getBall(){
        return this.#ball;
    }

    update(cursors = Phaser.Types.Input.Keyboard.CursorKeys){
        const speed =5;
        
        if(cursors.left?.isDown){
            if(this.x - (this.width/2 * 0.25) >0 ){
                this.x -= speed;
            }
            
        }else if(cursors.right?.isDown){
            if(this.x + (this.width/2 * 0.25) < 800 ){
                this.x += speed;
            }
        }
        if(this.#ball){
            this.#ball.x=this.x;
        }
    }
}