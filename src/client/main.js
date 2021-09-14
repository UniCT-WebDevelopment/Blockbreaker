const Phaser = require('phaser');
/* const Bootstrap = require('./scenes/bootstrap');
const Game = require('./scenes/game'); */

import Bootstrap from './scenes/bootstrap';
import Game from './scenes/game';
import Create_Join from './scenes/game/create_join';
import GameOver from './scenes/game/gameover';
import CreateRoom from './scenes/game/createroom';

import MainMenu from './scenes/mainMenu';
import JoinRoom from './scenes/game/joinroom';



const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#616190',
	parent: 'phaser',
	dom: {
        createContainer: true
    },
	scene: [ Bootstrap ,MainMenu,Create_Join ,Game ,GameOver, CreateRoom,JoinRoom],
	physics: {
		default: 'matter',
		matter: {
/* 		debug: {
				//staticLineColor: 0xff0000
			},  */
			gravity: { y: 0},
			setBounds:{
				left: true,
				right: true,
				top: true,
				bottom: false,
			}
		}
	},

}

var game = new Phaser.Game(config)
