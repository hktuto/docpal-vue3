// 在排序变更时无法及时渲染
import { onKeyUp, onKeyDown } from '@vueuse/core'
export class shiftCtrlSelection {
  isCtrl: boolean = false
  isShift: boolean = false
  startPoint: number = -1
  endPoint: number = -1
  rowKey: string = ''
  listObj: any = {}
  selectedList: any[] = []
  highLight: boolean = true
  constructor(list: any, rowKey: string){

    list = JSON.parse(JSON.stringify(list))
    this.selectedList = []
    // 在实例方法中,this就表示当前实例
    // 在构造函数中当前对象就时当前新建那个对象s
    // 可以通过this向新建的对象中添加属性
    this.listObj = list.reduce((prev:any, item:any) => {
      prev[`${item.rowIndex}`] = item
      return prev
    }, {})
    console.log(this.listObj);
    
    this.rowKey = rowKey
    onKeyDown('Control', (e) => {
      this.isCtrl = true
      this.isShift = false
      console.log(this.isCtrl, 'this.isCtrl', this.isShift, 'this.isShift');
    })
    onKeyUp('Control', (e) => {
      this.isCtrl = false
      console.log(this.isCtrl, 'this.isCtrl', this.isShift, 'this.isShift');
    })
    onKeyDown('Shift', (e) => {
      this.isShift = true
      this.isCtrl = false
      console.log(this.isShift, 'this.isShift', this.isCtrl, 'this.isCtrl');
    })
    onKeyUp('Shift', (e) => {
      // e.preventDefault();
      this.isShift = false
      console.log(this.isShift, 'this.isShift', this.isCtrl, 'this.isCtrl');
    })
  }

  select(row:any) {
    if(!this.rowKey) {
      console.error('rowKey undefined');
      return []
    }
    if(!this.isCtrl && !this.isShift) {
      this.selectedList = []
      this.startPoint = row.rowIndex
      this.selectedList.push(row)
    }
    if (this.isCtrl) { // 如果按下的是ctrl
      this.highLight = false   
      const index = this.selectedList.findIndex(item => item[this.rowKey] === row[this.rowKey])
      if (index > -1) this.selectedList.splice(index, 1)
      else {
        this.selectedList.push(row)
        this.startPoint = row.rowIndex
      }
    } else if (this.isShift) {
      if (this.startPoint === -1) {
        this.startPoint = row.rowIndex
        const index = this.selectedList.findIndex(item => item[this.rowKey] === row[this.rowKey])
        if(index === -1) this.selectedList.push(row)
      } else {
        this.startPoint = this.getStartPoint()
        this.endPoint = row.rowIndex
        if(this.endPoint < this.startPoint) {
          let flag = this.endPoint
          this.endPoint = this.startPoint
          this.startPoint = flag
        }
        for(let i = this.startPoint; i <=  this.endPoint; i++) {
          const listItem = this.listObj[i]
          const index = this.selectedList.findIndex(item => item[this.rowKey] === listItem[this.rowKey])
          if(index === -1) this.selectedList.push(listItem)
        }
      }
    }
    return this.selectedList
  }
  getStartPoint() {
    if(this.selectedList.length === 1) return this.selectedList[0].rowIndex
    else return this.startPoint
  }
}
export default shiftCtrlSelection
