var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function(done) {
    gulp.src('./style/**/*.sass')
        .pipe(sass())
        .pipe(gulp.dest("./style"))


    done();
});

gulp.task('serve', function(done) {

    gulp.watch('./style/**/*.sass', gulp.series('sass'));
  

    done();
});

gulp.task('default', gulp.series('sass', 'serve'));