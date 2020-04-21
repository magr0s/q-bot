const tvParser = (str, params) => {
  const tvs = Object.keys(params)

  return tvs.reduce((memo, tv) => {
    const regexp = new RegExp(`\\[tv.${tv}\\]`, 'g')

    return memo.replace(regexp, params[tv])
  }, str)
}


module.exports = tvParser
