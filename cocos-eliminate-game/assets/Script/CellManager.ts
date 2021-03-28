// cocos核心常量
const { ccclass, property } = cc._decorator;

@ccclass
export default class CellManager extends cc.Component {
    // #region 场景元素
    @property(cc.Node)
    Content: cc.Node = null;
    // #endregion

    // #region 素材
    // 单元格贴图素材
    @property(cc.SpriteFrame)
    CellSpriteFrameList: cc.SpriteFrame[] = [];
    // #endregion

    // #region 公有函数
    public updateSpriteFrame(index: number): void {
        this.Content.getComponent(cc.Sprite).spriteFrame = this.CellSpriteFrameList[index];
    }
    // #endregion
}
