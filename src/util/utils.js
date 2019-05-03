// 去掉值为空的项，返回object
function filterEmptyValue(object) {
  let query = {};
  Object.keys(object).forEach(key => {
    if (object[key] || object[key] === 0 || object[key] === false) {
      query[key] = object[key]
    }
  });
  return query
}


export default {
  filterEmptyValue: filterEmptyValue,
}
