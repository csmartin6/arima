#include "../../ctsa/header/ctsa.h"
#include <vector>

#ifndef API_H_
#define API_H_

#ifdef __cplusplus
extern "C" {
#endif

struct CompiledModel {
    int N;
    int Nused;
    int method;
    int optmethod;
    int p;// size of phi
    int d;// Number of times the series is to be differenced
    int q;//size of theta
    int s;// Seasonality/Period
    int P;//Size of seasonal phi
    int D;// The number of times the seasonal series is to be differenced
    int Q;//size of Seasonal Theta
    int r;// Number of exogenous variables
    int M; // M = 0 if mean is 0.0 else M = 1
    int ncoeff;// Total Number of Coefficients to be estimated
    std::vector<double> phi;
    std::vector<double> theta;
    std::vector<double> PHI;
    std::vector<double> THETA;
    std::vector<double> exog;
    std::vector<double> vcov;// Variance-Covariance Matrix Of length lvcov
    int lvcov; //length of VCOV
    std::vector<double> res;
    double mean;
    double var;
    double loglik;
    double aic;
    int retval;
    int start;
    int imean;
    std::vector<double> ts;
};

CompiledModel SarimaxObject2CompiledModel(sarimax_object* obj, std::vector<double> tsVec, std::vector<double> exogVec) ;
sarimax_object* CompiledModel2SarimaxObject(CompiledModel model);
CompiledModel AutoArimaObject2CompiledModel(auto_arima_object* obj, std::vector<double> tsVec, std::vector<double> exogVec);

// Fit arima model with known parameters i.e. (p,d,q)
CompiledModel fit(std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose);

// Autoarima
CompiledModel autofit(std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, bool verbose) ;

std::vector<double> predict(CompiledModel model, std::vector<double> newexogVec, int lout);
#ifdef __cplusplus
}
#endif

#endif
