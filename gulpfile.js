let gulp = require("gulp");
let ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");

const srcDir = "./src";
const dstDir = "./dist";

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist")); 
});

function copy() {
	return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));       
}

gulp.task('watch', function() {
    gulp.watch([`${srcDir}/*.ts`, `./index.ts`], { events: 'change' }, copy());
});