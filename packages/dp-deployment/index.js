const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));


function normalizeSetting(){
    let app = argv.app || 'client' 
    console.log(argv)
    let path = argv.path || '../../apps/client'
        const { pdfReaderUrl, PROXY, CLIENT_PROXY, ADMIN_PROXY, endPoint, DEFAULT_PATH, OFFICE_END_POINT, UPLOAD_END_POINT, DOCPAL_END_POINT, ADMIN_END_POINT } = argv
    if(!pdfReaderUrl || !PROXY || !CLIENT_PROXY || !ADMIN_PROXY || !endPoint || !DEFAULT_PATH || !OFFICE_END_POINT || !UPLOAD_END_POINT || !DOCPAL_END_POINT || !ADMIN_END_POINT || !app || !path) throw new Error('Missing arguments')
    return {
        app,
        path,
        setting:{
            pdfReaderUrl,
            PROXY,
            CLIENT_PROXY,
            ADMIN_PROXY,
            endPoint,
            DEFAULT_PATH,
            OFFICE_END_POINT,
            UPLOAD_END_POINT,
            DOCPAL_END_POINT,
            ADMIN_END_POINT
        }
    }
}

function generateJson(){
    const config = normalizeSetting()

    fs.writeFileSync(`${config.path}/public/siteSettingTest.json`, JSON.stringify(config.setting))
}


generateJson()

