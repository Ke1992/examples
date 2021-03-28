// 业务库
import CellManager from './CellManager';
// 常量
import { CELL_WIDTH, CELL_TYPE_COUNT } from './Shared/const';
// cocos核心常量
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    // #region 场景元素
    @property(cc.Node)
    GameArea: cc.Node = null;
    // #endregion

    // #region 预制体
    // 单元格
    @property(cc.Prefab)
    Cell: cc.Prefab = null;
    // #endregion

    onLoad(): void {
        const rowLength = 6;
        const columnLength = 8;
        // 设置游戏区域宽高
        this.GameArea.width = rowLength * CELL_WIDTH;
        this.GameArea.height = columnLength * CELL_WIDTH;
        // 遍历生成单元格
        for (let x = 0; x < rowLength; x += 1) {
            for (let y = 0; y < columnLength; y += 1) {
                // 获取位置
                const position = new cc.Vec2(x * CELL_WIDTH, y * CELL_WIDTH * -1);
                // 生成单元格
                const cell = cc.instantiate(this.Cell);
                // 更新贴图素材
                cell.getComponent(CellManager).updateSpriteFrame(
                    Math.floor(Math.random() * new Date().getTime()) % CELL_TYPE_COUNT,
                );
                // 渲染到页面
                cell.setPosition(position);
                cell.setParent(this.GameArea);
            }
        }
    }
}
