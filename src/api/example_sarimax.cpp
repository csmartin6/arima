#include <iostream>
#include <iterator>
#include <fstream>
#include <vector>
#include <algorithm>
#include <string>
#include "./api.h"
#include <chrono>

using namespace std;

int main()
{   
    std::ifstream is("src/api/data/S4248SM144NCEN.txt");
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


    auto fit_sarimax_start = std::chrono::high_resolution_clock::now();
    sarimax_object* obj = fit_sarimax_old(ts.data(), exog.data(), p, d, q, P, D, Q, s,  nexog, lin, method, opt, verbose);
    auto fit_sarimax_end = std::chrono::high_resolution_clock::now();
    auto fit_sarimax_ms = std::chrono::duration_cast<std::chrono::milliseconds>(fit_sarimax_end - fit_sarimax_start);
    CompiledSarimax model_from_obj = SarimaxObject2CompiledSarimax(obj);

    sarimax_object* obj2 =  CompiledSarimax2SarimaxObject(SarimaxObject2CompiledSarimax(obj));
    CompiledSarimax model_from_obj2 = SarimaxObject2CompiledSarimax(obj2);
    
    auto fit_sarimax_vector_start = std::chrono::high_resolution_clock::now();
    CompiledSarimax model = fit_sarimax(ts, exog, p, d, q, P, D, Q, s,  nexog, lin, method, opt, verbose);
    auto fit_sarimax_vector_end = std::chrono::high_resolution_clock::now();
    auto fit_sarimax_vector_ms = std::chrono::duration_cast<std::chrono::milliseconds>(fit_sarimax_vector_end - fit_sarimax_vector_start);
    sarimax_object* obj_from_model = CompiledSarimax2SarimaxObject(model);

    int num_periods = 12;
    double* predictions_obj = predict_sarimax_old (obj, ts.data(), exog.data(), NULL, num_periods);

    std::vector<double> predictions_from_obj(predictions_obj, predictions_obj+ num_periods * 2);
    std::vector<double> predictions_vector = predict_sarimax(model, ts, exog, exog, 12);

    std::vector<double> predictions_vector2 = predict_sarimax(model_from_obj, ts, exog, exog, 12);
    std::vector<double> predictions_vector3 = predict_sarimax(model_from_obj2, ts, exog, exog, 12);

    auto auto_arima_start = std::chrono::high_resolution_clock::now();
    auto_arima_object* auto_arima_obj = fit_autoarima_old(ts.data(), exog.data(), 5, 2, 5, 2, 1, 2, 12,  nexog, lin, method, opt, approximation, search, verbose);
    auto auto_arima_end = std::chrono::high_resolution_clock::now();
    auto auto_arima_ms = std::chrono::duration_cast<std::chrono::milliseconds>(auto_arima_end-auto_arima_start);

    auto auto_arima_vector_start = std::chrono::high_resolution_clock::now();
    CompiledAutoArima auto_arima_model = fit_autoarima(ts, exog, 5, 2, 5, 2, 1, 2, 12,  nexog, lin, method, opt, approximation, search, verbose);
    auto auto_arima_vector_end = std::chrono::high_resolution_clock::now();
    auto auto_arima_vector_ms = std::chrono::duration_cast<std::chrono::milliseconds>(auto_arima_vector_end-auto_arima_vector_start);


    printf("\n fit_sarimax: %d ms: \n" ,fit_sarimax_ms);
    printf("\n fit_sarimax_vector: %d ms: \n" ,fit_sarimax_vector_ms);
    printf("\n auto_arima: %d ms: \n" ,auto_arima_ms);
    printf("\n auto_arima_vector: %d ms: \n" ,auto_arima_vector_ms);
    return 0;
} 