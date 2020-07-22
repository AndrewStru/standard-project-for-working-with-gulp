
// Rename build folder
let project_folder = require('path').basename(__dirname);
// Source folder
let source_folder = "#src";

let fs = require('fs');

/* paths to the source files (src), to the finished files (build), as well as to those whose changes need to be monitored (watch) */
let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" +source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		fonts: source_folder + "/fonts/*.ttf",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
	},
	clean: "./" + project_folder + "/"
}

/* connect gulp and plugins */
let {src, dest,} = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync'),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webpHTML = require('gulp-webp-html'),
	webpcss = require("gulp-webpcss"),
	svgSprite = require('gulp-svg-sprite'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	rigger = require('gulp-rigger');

// Start server LocalHost
function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port:3000,
		notify: false
	})
}

// Build html files
function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webpHTML())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

// Build css files
function css() {
	return src(path.src.css)
		.pipe(
			scss({
			outputStyle: "expanded"
		})
		)
		.pipe(
			group_media()
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 2 versions'],
				cascade: true
			})
		)
		.pipe(webpcss({webpClass: '.webp',noWebpClass: '.no-webp'}))
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

// Build JavaScript files
function js() {
	return src(path.src.js)
		.pipe(rigger())
		.pipe(dest(path.build.js))
		.pipe(
			uglify()
		)
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

// Convert images
function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				interlaced: true,
				progressive: true,
				optimizationLevel: 3, // from 0 to 7
				svgoPlugins: [{removeViewBox: true}]
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

// Build and convert fonts
function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
};

gulp.task('otf2ttf', function() {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
        	formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/'));
})

// The task of assembling svg sprites (runs separately)
gulp.task('svgSprite', function() {
	return gulp.src([source_folder + '/iconsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../icons/icons.svg", // Path to save files
					example: true    // You can create an HTML file with examples of icons
				}
			},
		}
	))
	.pipe(dest(path.build.img))
})

// function for connecting fonts to a .scss file
function fontsStyle(params) {
	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
					fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
				}
				c_fontname = fontname;
				}
			}
		})
	}
}

function cb() {

}

// Monitoring file changes
function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

// Clearing the project folder
function clean(params) {
	return del(path.clean);
}


let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.fontsStyle = fontsStyle;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;

