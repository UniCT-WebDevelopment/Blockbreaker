
//import { Schema, type } from '@colyseus/schema';


const schema = require('@colyseus/schema');
const Schema = schema.Schema;






class BlockBreakerState extends Schema {
  constructor(){
    super();
    this.level = this.getRandomInt(3);
    this.state= 'joining';
    
    console.log(this.level);
  }



  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}
schema.defineTypes(BlockBreakerState, {
  level: "number",
  state: 'string'

});


exports.BlockBreakerState = BlockBreakerState;


/* class BlockBreakerState extends schema.Schema {
  constructor(){
    super();
    this.level = this.getRandomInt(3);
    console.log(this.level);
  }



  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  

  
}
 

schema.defineTypes(BlockBreakerState, {
  level: "number",
  state: 'state',
  ended: 'boolean'
});




exports.BlockBreakerState = BlockBreakerState; */