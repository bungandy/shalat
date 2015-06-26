module.exports = function(grunt) {

	// dependency -----------------
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	

	//config ----------------------
	grunt.initConfig({

		browserSync: {
			files: {
				src : [
					'app/assets/css/*.css',
					'app/assets/img/*',
					// 'app/assets/js/script.min.js',
					'app/partials/*.html',
					'app/*.html'
					],
			},
			options: {
				watchTask: true
			}	
		},

		watch: {
			compass: {
				files: ['app/assets/css/sass/*.{scss,sass}'],
				tasks: ['compass:dev']
			},
			js: {
				// files: ['app/assets/js/*.js'],
				tasks: ['uglify']
			}
		},

		compass: {
			dev: {
				options: {              
					sassDir: ['app/assets/css/sass'],
					cssDir: ['app/assets/css'],
					environment: 'development'
				}
			},
			prod: {
				options: {              
					sassDir: ['app/assets/css/sass'],
					cssDir: ['app/assets/css'],
					environment: 'production'
				}
			},
		},

		uglify: {
			all: {
				files: {
					'app/assets/js/script.min.js': [
						'app/bower_components/jquery/dist/jquery.js',
						'app/bower_components/bootstrap/dist/js/bootstrap.min.js'
					]
				}
			},
		},

	});


	// task ------------------------
	grunt.registerTask('default', ['watch','browserSync']);

};