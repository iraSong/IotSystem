import moment from 'moment'
const getTime = function(){
  let time = {
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
    y: moment().get('year'),
    mon: moment().get('month'), // 需要 + 1
    d: moment().get('date'),
    h: moment().get('hour'),
    m: moment().get('minute'),
    s: moment().get('second'),
  }
  return time
}
export default getTime