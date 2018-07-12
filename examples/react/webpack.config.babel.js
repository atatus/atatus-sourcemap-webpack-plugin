import path from 'path';
import cp from 'child_process';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import AtatusSourceMapPlugin from 'atatus-sourcemap-webpack-plugin';

const atatusAPIKey = 'e13e97f046a24432ae12098d68b07afd';
const atatusAdminAPIKey = 'e9e48c0813574957ace77b8eea101032';

// Enable below code if you upload the assets to S3 bucket.
// import S3Plugin from 'webpack-s3-plugin';
// const bucket = 'BUCKET_HERE';
// const s3Options = {
//   accessKeyId: 'ACCESS_KEY_HERE',
//   secretAccessKey: 'SECRECT_KEY_HERE',
//   region: 'REGION_HERE'
// };
// const basePath = 'assets';
// const url = `https://s3-${s3Options.region}.amazonaws.com/${bucket}/${basePath}`;
const url = 'https://my.cdn.net/assets';   // Coment this line when you enable the S3 support.

let version;
try {
  version = cp.execSync('git rev-parse HEAD', {
    cwd: __dirname,
    encoding: 'utf8'
  });
} catch (err) {
  console.log('Error getting revision', err); // eslint-disable-line no-console
  process.exit(1);
}

export default {
  devtool: 'source-map',
  entry: {
    app: './src/index',
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    url,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      /* eslint-disable quote-props */
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      },
      /* eslint-enable quote-props */
      __ATATUS_API_KEY__: JSON.stringify(atatusAPIKey),
      __GIT_REVISION__: JSON.stringify(version)
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: false
    }),
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // Enable below code if you upload the assets to S3 bucket.
    // Publish minified source
    // new S3Plugin({
    //   include: /\.js$/,
    //   basePath,
    //   s3Options,
    //   s3UploadOptions: {
    //     Bucket: bucket,
    //     ACL: 'public-read',
    //     ContentType: 'application/javascript'
    //   }
    // }),
    // Publish sourcemap, but keep it private
    // new S3Plugin({
    //   include: /\.map$/,
    //   basePath: `${basePath}`,
    //   s3Options,
    //   s3UploadOptions: {
    //     Bucket: bucket,
    //     ACL: 'private',
    //     ContentType: 'application/json'
    //   }
    // }),
    // Upload emitted sourcemaps to atatus
    new AtatusSourceMapPlugin({
      adminAPIKey: atatusAdminAPIKey,
      version,
      url
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      }
    ]
  }
};
