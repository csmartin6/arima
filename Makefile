# vim: set noet:
CC = emcc
CXX = em++

# FILES =  libmvar/mvardie.c libmvar/mvarfit.c libmvar/mvarmat.c libmvar/mvarsim.c libmvar/mvartest.c
FILES = ctsa/src/*.c

EXPORTED_FUNCTIONS="['_fit_sarimax_old', '_predict_sarimax_old', '_fit_autoarima_old', '_predict_autoarima_old']"

CFLAGS = -Wall -fPIC --memory-init-file 0 -O3 
EMCFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -s MODULARIZE=1 -s WASM=0 --bind 

# build:
# 	${CC} ${CFLAGS} ${EMCFLAGS} ${FILES} src/api/api.cpp -o src/wasm/native.js -s BINARYEN_ASYNC_COMPILATION=0;

buildWasm:
	${CC} ${CFLAGS} ${EMCFLAGS} ${FILES} src/api/api.cpp -o src/arima-emscripten-module.js 
	# -s BINARYEN_ASYNC_COMPILATION=0;

buildExample:
	gcc ${FILES} -g src/api/api.cpp src/api/example_sarimax.cpp -lm -lstdc++ -o src/api/example_sarimax
	
