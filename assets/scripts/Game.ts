import Ball from "../prefabs/Ball/Ball";
import SquareControl from "./SquareControl";

const {ccclass, property} = cc._decorator;
const BallColorArray = [cc.color(255,102,102,255),cc.color(255,255,102,255),cc.color(0,255,128,255),cc.color(102,102,255,255)]

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab) ballPrefab:cc.Prefab = null;

    @property(cc.Node) square:cc.Node = null;

    @property(cc.Label) socreLabel:cc.Label = null;

    @property(cc.SpriteFrame) boomSpriteFrame:cc.SpriteFrame = null;


    ballNodePool:cc.NodePool = null;

    gameScore:number = 0;


    addScore(val:number){
        this.gameScore += val;
        this.socreLabel.string = `${this.gameScore}`;
    }

    onLoad () {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;



        this.ballNodePool = new cc.NodePool(Ball);
        let initCount = 4;
        for (let i = 0; i < initCount; ++i) {
            let ball = cc.instantiate(this.ballPrefab);
            this.ballNodePool.put(ball);
        }

        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
            if(touchPos.x<0){
                this.square.getComponent(SquareControl).turnLeft();
            }
            else{
                this.square.getComponent(SquareControl).turnRight();
            }
        })

    }

    start () {
        this.createBall();
        this.schedule(()=>{
            this.createBall();

        },4.0);

    }

    removeBall(ball:cc.Node){
        this.ballNodePool.put(ball);
    }

    createBall(){
        let ball = this.ballNodePool.get();
        if(!ball){
            ball = cc.instantiate(this.ballPrefab);
        }
        this.node.addChild(ball);
        ball.position = cc.v2(0,320);
        ball.runAction(cc.sequence(cc.moveTo(3.0,cc.v2(0,-320)),cc.callFunc(()=>{
            this.ballNodePool.put(ball);
        })))
    }


    boom(pos:cc.Vec2,type:number){

        for(let i = 0;i<50;i++){
            let size = ~~(Math.random()*10)+5;
            let len = ~~(Math.random()*20)+10;
            let rotate = ~~(Math.random()*360);
            let time = Math.random()*0.3;

            let temp = new cc.Node();
            temp.addComponent(cc.Sprite).spriteFrame = this.boomSpriteFrame;
            this.node.addChild(temp);
            temp.position = pos;
            temp.setContentSize(size,size);
            temp.color = BallColorArray[type];

            let x = Math.sin(rotate/180*Math.PI)*len;
            let y = x*Math.tan(rotate/180*Math.PI);

            temp.runAction(cc.sequence(cc.moveBy(time,cc.v2(x,y)),cc.removeSelf()));

        }




    }



    // update (dt) {}
}
