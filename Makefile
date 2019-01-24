build: node_modules www www/app.js www/index.html www/style.css

node_modules: package.json
	npm install

www:
	mkdir -p www

www/app.js: src/*.js
	./node_modules/.bin/browserify \
		--ignore react --ignore react-dom --ignore moment \
		-t [ babelify --presets [ @babel/preset-env @babel/preset-react ] ] \
		src/web.js >www/app.js

www/%.html: src/%.html
	cp $^ www/

www/%.css: src/%.css
	cp $^ www/

test: ALWAYS
	tape tests/*.js

clean: ALWAYS
	rm -rf www/

ALWAYS:
