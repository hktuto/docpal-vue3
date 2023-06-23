import {api} from "../index";


export const getOcrDocApi = async ( idOrPath:string ):Promise<Blob> => {
    const response = await api.post('/nuxeo/document/attachment/hocr/download', {idOrPath}, {responseType:'blob', timeout: 0}).then(res => res.data);
    if(response.size === 0) throw new Error('No data');
    let text = await response.text();
    const defaultStyle = `
            <style id="frontendCustomStyle">
                *{
                    font-family: 'Segoe UI', 'Roboto', Oxygen, Ubuntu, Cantarell, -apple-system,
                                BlinkMacSystemFont, 'Open Sans', 'Helvetica Neue', sans-serif;
                    font-size: 14px;
                    line-height: 1;
                }
                body{
                    counter-reset: page;
                }
                .ocr_page{
                    padding: 10px;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
                    margin-bottom: 24px;
                    counter-increment: page;
                    background-color: #fff;
                }
                .ocr_page::before{
                    content: counter(page);
                    display:block;
                }
                .ocr_line{
                    display: block;
                    margin-bottom: 6px;
                    word-break: break-all;
                }
                .ocrx_word.hover {
                    background-color: rgba(13,89,170,0.3);
                    border: 2px solid #007eff;
                }
                .ocr_line.hover {
                    background-color: rgba(13,89,170,0.1);
                }
            </style>
            </body>
        `
    text = text.replace('</body>', defaultStyle).replace('<title />', '');
    return new Blob([text], {type: 'text/html'});
}