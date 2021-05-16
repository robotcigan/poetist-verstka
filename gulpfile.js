const gulp = require('gulp');
const { series } = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const webp = require('imagemin-webp');
const extReplace = require('gulp-ext-replace');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const pugInheritance = require('gulp-pug-inheritance');
const changed = require('gulp-changed');
const cached = require('gulp-cached');


swallowError = (error) => {
  console.log('error from swallow function -> ', error.toString());
  return this.emit('end');
};

function html() {
  return gulp.src('pug/*.pug')
    .pipe(changed('dist/', {extension: '.html'}))
    .pipe(cached('html'))
    .pipe(pugInheritance({basedir: 'pug', skip: 'node_modules'}))
    .pipe(pug({
      pretty: true
    }))
    .on('error', swallowError)
    // .pipe(reload)
    .pipe(gulp.dest('dist/'), browserSync.reload())
}

function css() {
  return gulp.src('styles/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
        'include css': true
      }))
    .on('error', swallowError)
    .pipe(autoprefixer({
      grid: 'autoplace',
      browsers: ['> 1%', 'last 5 version', 'IE 10'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/styles/css/'))
    .pipe(reload({
      stream: true,
      match: '**/*.css'
    }));
}

function images() {
  return gulp.src('img/**/*')
    .pipe(imagemin([
      imagemin.jpegtran({
        progressive: true
      })
    ]))
    .pipe(gulp.dest('dist/img'))
}

function imagesWebp() {
  return gulp.src('img/**/*.+(png|jpg|gif)')
    .pipe(imagemin([
      webp({
        quality: 100
      })
    ]))
    .pipe(extReplace('.webp'))
    .pipe(gulp.dest('dist/img/webp'))
}

function js() {
  return gulp.src('js/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', swallowError)
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({
      stream: true
    }))
}

function watch() {
  browserSync({
    server: './dist/',
    notify: false,
    open: false
  })
  gulp.watch('pug/*.pug', html);
  gulp.watch('styles/**/*.styl', css);
  gulp.watch('img/**/*', images);
  gulp.watch('img/**/*', imagesWebp);
  gulp.watch('js/**/*.js', js)
}


exports.default = series(html, css, images, imagesWebp, js, watch);
