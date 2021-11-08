#include <iostream>
#include <iterator>
#include <fstream>
#include <vector>
#include <algorithm>
#include <string>
#include "./api.h"
#include <chrono>
#include <random>


using namespace std;

std::random_device rd;
std::mt19937 mt(rd());
std::uniform_real_distribution<double> dist(1.0, 10.0);


double get_rand() {
    return dist(mt);
}

int main()
{
    std::ifstream is("../../resources/data/S4248SM144NCEN.txt");
    std::istream_iterator<double> start(is), end;
    std::vector<double> numbers(start, end);
    std::cout << "Read " << numbers.size() << " numbers" << std::endl;
    vector<double> ts(numbers.begin()+200, numbers.end()-20);
    std::cout << "Using " << ts.size() << " numbers" << std::endl;
    // vector<double> exog(numbers.begin(),numbers.begin()+133);

    int p = 2;
    int d = 1;
    int q = 0;
    int P = 2;
    int D = 1;
    int Q = 1;
    int s = 12;
    int nexog = 2;
    int lin = ts.size();
    int method = 0;
    int opt = 6;
    int approximation = 0;
    int search = 0;

    vector<double> exog(ts.size() * nexog, 0.0);
    std::generate(exog.begin(), exog.end(), get_rand);
    bool verbose = true;


    auto fit_start = std::chrono::high_resolution_clock::now();
    CompiledModel model = fit(ts, exog, p, d, q, P, D, Q, s,  nexog, lin, method, opt, verbose);

    auto fit_end = std::chrono::high_resolution_clock::now();
    auto fit_ms = std::chrono::duration_cast<std::chrono::milliseconds>(fit_end - fit_start);
    int num_periods = 12;
    vector<double> newExog(num_periods * nexog, 0.0);
    std::generate(newExog.begin(), newExog.end(), get_rand);
    auto predict_start = std::chrono::high_resolution_clock::now();
    std::vector<double> predictions = predict(model, newExog, num_periods);
    auto predict_end = std::chrono::high_resolution_clock::now();
    auto predict_ms = std::chrono::duration_cast<std::chrono::milliseconds>(predict_end - predict_start);

    std::cout << "Fixed" << std::endl;
    for (int i = 0; i < num_periods; i++) {
        std::cout << "i: "<< i << " (" << predictions[i] << ", " << predictions[num_periods+i] << ")" << std::endl;
    }

    auto auto_arima_start = std::chrono::high_resolution_clock::now();
    CompiledModel auto_arima_model = autofit(ts, exog, 5, 2, 5, 2, 1, 2, 12,  nexog, lin, method, opt, approximation, search, verbose);
    auto auto_arima_end = std::chrono::high_resolution_clock::now();
    auto auto_arima_ms = std::chrono::duration_cast<std::chrono::milliseconds>(auto_arima_end-auto_arima_start);

    auto predict_auto_start = std::chrono::high_resolution_clock::now();
    std::vector<double> predictions_auto = predict(auto_arima_model, newExog, num_periods);
    auto predict_auto_end = std::chrono::high_resolution_clock::now();
    auto predict_auto_ms = std::chrono::duration_cast<std::chrono::milliseconds>(predict_auto_end - predict_auto_start);

    std::cout << "auto" << std::endl;
    for (int i = 0; i < num_periods; i++) {
        std::cout << "i: "<< i << " (" << predictions_auto[i] << ", " << predictions_auto[num_periods+i] << ")" << std::endl;
    }

    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << "Timing" << std::endl;
    std::cout << "fit: " << fit_ms.count() << " ms" << std::endl;
    std::cout << "autofit: " << auto_arima_ms.count() << " ms" << std::endl;
    std::cout << "predict: " << predict_ms.count() << " ms" << std::endl;
    return 0;
}
