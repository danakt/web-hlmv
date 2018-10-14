import { Configuration }      from 'webpack'
import * as path              from 'path'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

const config: Configuration = {
  devtool: 'source-map',
  entry:   './ui/index.tsx',
  module:  {
    rules: [
      {
        test:    /\.tsx?$/,
        use:     'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.mdl$/,
        use:  'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path:     path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.html')
    })
  ]
}

export default config
