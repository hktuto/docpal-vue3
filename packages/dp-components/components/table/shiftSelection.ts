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
    this.selectedList.push(row)
    console.log(row, this.selectedList);
  }
}
export default shiftCtrlSelection
