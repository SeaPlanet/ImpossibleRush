const {ccclass, property} = cc._decorator;


@ccclass
export default class Ball extends cc.Component {

    //界面的数组
    @property([cc.SpriteFrame]) images:Array<cc.SpriteFrame> = [];

    // LIFE-CYCLE CALLBACKS:

    _ballType:number = 0;
    
    set BallType(val:number){
        this._ballType = val;
    }

    get BallType():number{
        return this._ballType;
    }

    // onLoad () {}

    start () {

    }

    unuse() {

        this.node.stopAllActions();

    }

    reuse(id?:number) {
        
        if(id){
            this._ballType = id;
            this.node.getComponent(cc.Sprite).spriteFrame = this.images[id];
        }else{
            let randomId = ~~(Math.random()*this.images.length);
            this._ballType = randomId;
            this.node.getComponent(cc.Sprite).spriteFrame = this.images[randomId];
        }
    }




    // update (dt) {}
}
