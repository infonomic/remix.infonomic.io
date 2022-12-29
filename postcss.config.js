// postcss.config.js
module.exports = cfg => {

  const
    dev = cfg.env === 'development',
    scss = cfg.file.extname === '.scss'

  return {
    map: dev ? { inline: true } : false,
    parser: scss ? 'postcss-scss' : false,

    plugins: {
      'postcss-import': {},
      'postcss-nested': {},
      tailwindcss: {},
      autoprefixer: {},
      ...(dev ? {} : { cssnano: {} }),
    },
  }
}