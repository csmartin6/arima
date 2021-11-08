#include <iostream>
#include <iterator>
#include <fstream>
#include <vector>
#include <algorithm>
#include <string>
#include "../../api/api.h"

#define CATCH_CONFIG_MAIN
#define CATCH_CONFIG_ENABLE_BENCHMARKING
#include "../../../include/catch2/catch.hpp"

using namespace std;

TEST_CASE("Benchmarking Model") {

    std::ifstream is("resources/data/S4248SM144NCEN.txt");
    std::istream_iterator<double> start(is), end;
    std::vector<double> numbers(start, end);
    std::cout << "Read " << numbers.size() << " numbers" << std::endl;
    vector<double> ts(numbers.end()-153, numbers.end()-1);
    vector<double> exog;
    int p = 2;
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



    BENCHMARK("Basic Arima Fit") {
        CompiledModel model = fit(ts, exog, p, d, q, P, D, Q, s,  nexog, lin, method, opt, verbose);
        return model;
    };

    // This benchmark takes a long time.
    // BENCHMARK("AutoArima Fit") {
    //     CompiledModel autoModel = autofit(ts, exog, 5, 2, 5, 2, 1, 2, 12,  nexog, lin, method, opt, approximation, search, verbose);
    // };

    BENCHMARK("Arima Predict 12") {
        int num_periods = 12;
        std::vector<double> predictions_vector = predict(model, exog, num_periods);
        return predictions_vector;
    };

    BENCHMARK("Arima Predict 100") {
        int num_periods = 100;
        std::vector<double> predictions_vector = predict(model, exog, num_periods);
        return predictions_vector;
    };

    BENCHMARK("Arima Predict 1000") {
        int num_periods = 1000;
        std::vector<double> predictions_vector = predict(model, exog, num_periods);
        return predictions_vector;
    };
}
