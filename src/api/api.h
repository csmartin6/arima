#include "../../ctsa/header/ctsa.h"
#include <vector>

#ifndef API_H_
#define API_H_

#ifdef __cplusplus
extern "C" {
#endif

struct CompiledSarimax {
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
    // double *exog;
    // double *vcov;// Variance-Covariance Matrix Of length lvcov
    int lvcov; //length of VCOV
    std::vector<double> res;
    double mean;
    double var;
    double loglik;
    double aic;
    int retval;
    int start;
    int imean;
};

struct CompiledAutoArima {
	int N;// length of time series
	int Nused;//length of time series after differencing, Nused = N - d
	int method;
	int optmethod;
	int pmax;// Maximum size of phi
	int dmax;// Maximum Number of times the series is to be differenced
	int qmax;// Maximum size of theta
	int Pmax;//Maximum Size of seasonal phi
	int Dmax;// Maximum number of times the seasonal series is to be differenced
	int Qmax;//Maximum size of Seasonal Theta
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
	// std::vector<double> exog;
	// std::vector<double> vcov;
	int lvcov; //length of VCOV
	std::vector<double> res;
	double mean;
	double var;
	double loglik;
	double ic;
	int retval;
	int start;
	int imean;
	int idrift;
	int stationary;
	int seasonal;
	int Order_max;
	int p_start;
	int q_start;
	int P_start;
	int Q_start;
	std::string information_criteria;
	int stepwise;
	int num_models;
	int approximation;
	int verbose;
	std::string test;
	std::string type;
	std::string seas;
	double alpha_test;
	double alpha_seas;
	double lambda;
	double sigma2;
	double aic;
	double bic;
	double aicc;
	// double params[0];
};


CompiledSarimax SarimaxObject2CompiledSarimax(sarimax_object* obj);
sarimax_object* CompiledSarimax2SarimaxObject(CompiledSarimax model);

CompiledAutoArima AutoArimaObject2CompiledAutoArima(auto_arima_object* obj);
auto_arima_object* CompiledAutoArima2SarimaxObject(CompiledAutoArima model);

CompiledSarimax fit_sarimax(std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose);
sarimax_object* fit_sarimax_old (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose);
double* predict_sarimax_old (sarimax_object* obj, double* ts, double* exog, double* newexog, int lout);
std::vector<double> predict_sarimax (CompiledSarimax model, std::vector<double> tsVec, std::vector<double> exogVec, std::vector<double> newexogVec, int lout);
auto_arima_object* fit_autoarima_old (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, bool verbose);
double* predict_autoarima_old (auto_arima_object* obj, double* ts, double* exog, double* newexog, int lout);
CompiledAutoArima fit_autoarima (std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, bool verbose) ;
std::vector<double> predict_autoarima (CompiledAutoArima model, std::vector<double> tsVec, std::vector<double> exogVec, std::vector<double> newexogVec, int lout);
#ifdef __cplusplus
}
#endif

#endif
