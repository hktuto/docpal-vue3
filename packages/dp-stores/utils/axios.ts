// @ts-nocheck
/**
 * 取消axios请求
 * @param cellArr 要取消的接口；如果不传参，则取消canCancelAxios保存的所有接口
 */
export function cancelAxios(cellArr = []) {
    if (cellArr.length > 0) {
        cellArr.forEach(val => {
            for (let i = 0; i < window.canCancelAxios.length; i++) {
                if (window.canCancelAxios[i].key === val) {
                    window.canCancelAxios[i].cancel();
                    window.canCancelAxios.splice(i, 1);
                    i--;
                }
            }
        })
    } else if(window.canCancelAxios) {
        for (let i = 0; i < window.canCancelAxios.length; i++) {
            window.canCancelAxios[i].cancel();
            window.canCancelAxios.splice(i, 1);
            i--;
        }
    }
}
  