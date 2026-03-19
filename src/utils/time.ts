// 封装一个函数，获取一个结果：早上|上午|中午|下午|晚上
export const getTime = () => {
    // 通过内置构造函数Date
    const hours = new Date().getHours();
    let title = '';
    if (hours <= 9) {
      title = '早上'
    } else if ( hours <= 11) {
      title = '上午'
    } else if ( hours <= 13) {
      title = '中午'
    } else if ( hours <= 18) {
      title = '下午'
    } else {
      title = '晚上'
    }
    return title;
}