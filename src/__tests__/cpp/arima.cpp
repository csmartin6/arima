#include <iostream>
#include <iterator>
#include <fstream>
#include <vector>
#include <algorithm>
#include <string>
#include "../../api/api.h"

#define CATCH_CONFIG_MAIN
#include "../../../include/catch2/catch.hpp"

using namespace std;

CompiledModel fitModel() {
    std::ifstream is("resources/data/S4248SM144NCEN.txt");
    std::istream_iterator<double> start(is), end;
    std::vector<double> numbers(start, end);
    std::cout << "Read " << numbers.size() << " numbers" << std::endl;
    vector<double> ts(numbers.begin()+200, numbers.end()-20);
    vector<double> exog;
    int p = 0;
    int d = 1;
    int q = 1;
    int P = 2;
    int D = 1;
    int Q = 1;
    int s = 12;
    int nexog = 0;
    int lin = ts.size();
    int method = 0;
    int opt = 6;
    int approximation = 0;
    int search = 0;

    bool verbose = true;

    double* ts_ptr = ts.data();
    for (int i = 0; i < ts.size(); ++i) {
		ts_ptr[i] = ts[i];
	}
    double* exog_ptr = exog.data();
    for (int i = 0; i < exog.size(); ++i) {
		exog_ptr[i] = ts[i];
	}
    CompiledModel model = fit(ts, exog, p, d, q, P, D, Q, s,  nexog, lin, method, opt, verbose);
    return model;
}


TEST_CASE( "Fitting a model" ) {
    std::ifstream is("resources/data/S4248SM144NCEN.txt");
    std::istream_iterator<double> start(is), end;
    std::vector<double> numbers(start, end);
    std::cout << "Read " << numbers.size() << " numbers" << std::endl;
    vector<double> ts(numbers.begin()+200, numbers.end()-20);
    vector<double> exog;

    SECTION( "fitting a sarimax model" ) {
        int p = 0;
        int d = 1;
        int q = 1;
        int P = 2;
        int D = 1;
        int Q = 1;
        int s = 12;
        int nexog = 0;
        int lin = ts.size();
        int method = 0;
        int opt = 6;
        int approximation = 0;
        int search = 0;

        bool verbose = false;

        CompiledModel model = fit(ts, exog, p, d, q, P, D, Q, s,  nexog, lin, method, opt, verbose);
        REQUIRE( model.p == 0 );
        REQUIRE( model.d == 1 );
        REQUIRE( model.q == 1 );
        REQUIRE( model.P== 2 );
        REQUIRE( model.D == 1);
        REQUIRE( model.Q == 1 );
        REQUIRE( model.s == 12 );

        int num_periods = 12;
        std::vector<double> predictions_vector = predict(model, exog, 12);
        REQUIRE( predictions_vector.size() == 2*num_periods );
    }

    SECTION( "fitting an autorima model" ) {
        int nexog = 0;
        int lin = ts.size();
        int method = 0;
        int opt = 6;
        int approximation = 0;
        int search = 0;

        bool verbose = false;
        CompiledModel model = autofit(ts, exog, 5, 2, 5, 2, 1, 2, 12,  nexog, lin, method, opt, approximation, search, verbose);

        REQUIRE( model.p == 2 );
        REQUIRE( model.d == 1 );
        REQUIRE( model.q == 0 );
        REQUIRE( model.P== 2 );
        REQUIRE( model.D == 1);
        REQUIRE( model.Q == 1 );
        REQUIRE( model.s == 12 );

        int num_periods = 12;
        std::vector<double> predictions_vector = predict(model, exog, 12);
        REQUIRE( predictions_vector.size() == 2 * num_periods );
    }


}

