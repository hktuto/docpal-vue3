import { onKeyUp, onKeyDown } from '@vueuse/core'
export class shiftCtrlSelection {
  isCtrl: boolean = false
  isShift: boolean = false
  startPoint: number = -1
  endPoint: number = -1
  list: any[] = []
  selectedList: any[] = []
  constructor(list: any){
    // 在实例方法中,this就表示当前实例
    // 在构造函数中当前对象就时当前新建那个对象s
    // 可以通过this向新建的对象中添加属性
    this.list = list
    onKeyDown('Control', (e) => {
      this.isCtrl = true
      console.log(this.isCtrl, 'this.isCtrl', this.isShift, 'this.isShift');
    })
    onKeyUp('Control', (e) => {
      this.isCtrl = false
      console.log(this.isCtrl, 'this.isCtrl', this.isShift, 'this.isShift');
    })
    onKeyDown('Shift', (e) => {
      this.isShift = true
      console.log(this.isShift, 'this.isShift', this.isCtrl, 'this.isCtrl');
    })
    onKeyUp('Shift', (e) => {
      // e.preventDefault();
      this.isShift = false
      console.log(this.isShift, 'this.isShift', this.isCtrl, 'this.isCtrl');
    })
    
  }

  select(row:any) {
    if(!this.isCtrl && !this.isShift) {
      this.selectedList = []
      this.startPoint = row.index
      this.selectedList.push(row)
    }
    if (this.isCtrl) { // 如果按下的是ctrl   
      const index = this.selectedList.findIndex(item => item.index === row.index)
      if (index > -1) this.selectedList.splice(index, 1)
      else {
        this.selectedList.push(row)
        this.startPoint = row.index
      }
    } else if (this.isShift) {
      if (this.startPoint === -1) {
        this.startPoint = row.index
        const index = this.selectedList.findIndex(item => item.index === row.index)
        if(index === -1) this.selectedList.push(row)
      } else {
        this.endPoint = row.index
        for(let i = this.startPoint; i <=  this.endPoint; i++) {
          const listItem = this.list[i]
          const index = this.selectedList.findIndex(item => item.index === listItem.index)
          if(index === -1) this.selectedList.push(listItem)
        }
      }
    }
    console.log(row);
    console.log('console.log(row, this.selectedList);', this.selectedList);
    return this.selectedList
  }
}
export default shiftCtrlSelection
