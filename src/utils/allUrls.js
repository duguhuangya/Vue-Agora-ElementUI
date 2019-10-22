import qs from 'qs'

// let header = {'Content-Type': 'application/x-www-form-urlencoded'}
let header = {'Content-Type': 'application/json'}
let baseUrl = 'https://www.fastmock.site/mock/329c8f16f62093ecfde33a5de5013930/yolo'

//获取热门人物列表（首页）
export function getToplistPerson(methods, data) {
    return fetch('http://www.mocky.io/v2/5da1a12d3000002900f8a2fb',
        {method: methods, headers: header, body: qs.stringify(data)})
}

//获取首页推荐
export function getIndexPicRec(methods, data) {
    return fetch(baseUrl + '/api/getIndexRecPic',
        {method: methods, headers: header, body: qs.stringify(data)})
}

//获取首页“文章推荐”
export function getIndexEssay(methods, data) {
    return fetch(baseUrl + '/api/getIndexEssay',
        {method: methods, headers: header, body: qs.stringify(data)})
}