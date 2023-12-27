export async function svgToBase64(src: string, color: string = '#8796A4') {
    const file = await fetch(src)
    let svgText = await file.text()
    svgText = svgText.replace('<svg ', `<svg style="color: ${color}" `)
    svgText = svgText.replaceAll('fill="currentColor"', '')
    svgText = svgText.replaceAll('fill="none"', '')
    svgText = svgText.replaceAll('<path ', `<path fill="currentColor" `)
    let url = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgText)))}`
    return url
}

export async function parseSvg(src: string, cb: any) {
    return new Promise(async(resolve, reject) => {
        // 1、创建img
        var img = document.createElement('img')
        // 2、svg转base64
        img.setAttribute('src', await svgToBase64(src))
        // 3、转指定格式
        img.onload = function() {
            // 1、创建canvas
            var canvas = document.createElement('canvas')
            var context = canvas.getContext('2d')
            canvas.width = img.width
            canvas.height = img.height
            // 2、根据base64生成canvas
            context.drawImage(img, 0, 0)
            // 3、canvas转字符串
            resolve(canvas.toDataURL("image/png"))
        }
    })
}

