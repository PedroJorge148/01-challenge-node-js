export function extractQueryParams(query) {
  const reuslt = query.substr(1).split('&').reduce((queryParams, param) => {
    console.log(queryParams, param)
  })

  

  return {}
}