import Game from "./Game";
import Ball from "../prefabs/Ball/Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SquareControl extends cc.Component {

    @property(cc.Node) gameNode:cc.Node = null;

    canTurn:boolean = true;

    _squareType:number = 0;

    set SquareType(val:number){
        this._squareType = val;
    }
    get SquareType(){
        return this._squareType;
    }


    turnLeft():boolean{
        if(!this.canTurn){
            return false;
        }
        this._squareType++;
        if(this._squareType>3){
            this._squareType = 0;
        }
        this.canTurn = false;
        this.node.runAction(cc.sequence(cc.rotateBy(0.1,-90).easing(cc.easeBackOut()),
            cc.callFunc(()=>{
                this.canTurn = true;
            })
        ));

        return true; 
    }

    turnRight():boolean{
        if(!this.canTurn){
            return false;
        }
        this._squareType--;
        if(this._squareType<0){
            this._squareType = 3;
        }

        this.canTurn = false;
        this.node.runAction(cc.sequence(cc.rotateBy(0.1,90).easing(cc.easeBounceOut()),
            cc.callFunc(()=>{
                this.canTurn = true;
            })
        ));

        return true;
    }


    onCollisionEnter(other:cc.Collider, self:cc.Collider) {
        //当前的元素是球
        if(other.tag===10){
            let ballType:number = other.node.getComponent(Ball).BallType;      
            let boxType:number = this.SquareType;

            if(ballType===boxType){
                cc.log("增加一分！！！！！！！！");
                this.gameNode.getComponent(Game).addScore(1);
            }
            else{
                cc.log("游戏失败！！！！！！！！");
            }

            this.gameNode.getComponent(Game).boom(other.node.position,ballType);


            this.removeBall(other.node);
        }
    }



    removeBall(ball:cc.Node){
        this.gameNode.getComponent(Game).removeBall(ball);
    }

}
