const Phaser = require('phaser');

var powerType = [
    "fast",
    "slow"
]

export default class Paddle extends Phaser.Physics.Matter.Image{


    constructor(world, x, y){
        super(world,x,y,'fastPower',undefined, {
            chamfer:{
                radius: 12
            },
            collisionFilter:{
                category: 0x0003,
                mask: 0x0001,
            },
        });
        world.scene.add.existing(this);
        
        this.setFriction(0,0,0);
        this.setVelocityY(2);
        this.setData('type','power');
        this.powerChooser();
    }

    getPowerType(){
        return this.getData('power');
    }

    powerChooser(){

        var p = powerType[Phaser.Math.Between(0, powerType.length - 1)];
        if(p== 'fast'){
            this.setTexture('fastPower');
            this.setData('power','fast');
        }else{
            this.setTexture('slowPower');
            this.setData('power','slow');
        }

        //console.log(p);
    }




}
