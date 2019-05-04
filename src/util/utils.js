// 去掉值为空的项，返回object
function filterEmptyValue(object) {
  let query = {};
  Object.keys(object).forEach(key => {
    if (
      object[key] !== 0 &&
      object[key] !== false &&
      object[key] !== '' &&
      object[key] !== null
    ) {
      query[key] = object[key]
    }
  });
  return query
}
export default {
  filterEmptyValue: filterEmptyValue,
}
