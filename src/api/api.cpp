#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include "api.h"
#include "../../ctsa/header/ctsa.h"
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
using namespace emscripten;


struct PartialSarimax {
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
  //double *phi;
	// double *theta;
	// double *PHI;
	// double *THETA;
	// double *exog;
	// double *vcov;// Variance-Covariance Matrix Of length lvcov
	// int lvcov; //length of VCOV
	// double *res;
	double mean;
	double var;
	double loglik;
	double aic;
	int retval;
	int start;
	int imean;
};


// template <typename T> std::vector<T> vecFromJSArray(const emscripten::val &v)
// {
//     std::vector<T> rv;

//     const auto l = v["length"].as<unsigned>();
//     rv.resize(l);

//     emscripten::val memoryView{emscripten::typed_memory_view(l, rv.data())};
//     memoryView.call<void>("set", v);

//     return rv;
// }
PartialSarimax test_sarimax_vector(std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose) {
    double *ts = tsVec.data();
    double *exog = exogVec.data();
    sarimax_object* obj;
    obj = (sarimax_object*)malloc(sizeof(sarimax_object));

    if (nexog == 0) {
      exog = NULL;
    }

    // TODO: Do we really need the following?

    // double *phi, *theta;
    // double *PHI, *THETA;

    // phi = (double*)malloc(sizeof(double)* p);
    // theta = (double*)malloc(sizeof(double)* q);
    // PHI = (double*)malloc(sizeof(double)* P);
    // THETA = (double*)malloc(sizeof(double)* Q);

    *obj = sarimax_init(p, d, q, P, D, Q, s, nexog, 1, lin);

    sarimax_setMethod(*obj, method);
    sarimax_setOptMethod(*obj, opt);
    sarimax_exec(*obj, ts, exog);

    if (verbose) {
      printf("\n SARIMAX summary: \n");
      sarimax_summary(*obj);
    }
    sarimax_set o = **obj;
    PartialSarimax b;
    b.N = o.N;
    b.Nused = o.Nused;
    b.method = o.method;
    b.optmethod = o.optmethod;
    b.p = o.p;
    b.d = o.d;
    b.q = o.q;
    b.s = o.s;
    b.P = o.P;
    b.D = o.D;
    b.Q = o.Q;
    b.r = o.r;
    b.M = o.M;
    b.ncoeff = o.ncoeff;
    printf("\n p:  {%i}  \n", b.p);
    std::vector<double> phiVec(o.phi, o.phi+o.p);
    // for (int i = 0; i < o.p; ++i) {
		//   phiVec.push_back(o.phi[i]);
	  // }
    printf("\n phiVec : \n");
    // for (auto i = phiVec.begin(); i != phiVec.end(); ++i) {
    //   printf("\n  {%f}  \n", i);
    // }
    for (int i = 0; i < o.p; ++i) {
		  printf("\n  {%f}  \n", phiVec[i]);
	  }
    b.phi = phiVec;
    // b.theta = o.theta;
    // b.PHI = o.PHI;
    // b.THETA = o.THETA;
    // b.exog = o.exog;
    // b.vcov = o.vcov;
    // b.lvcov = o.lvcov;
    // b.res = o.res;
    b.mean = o.mean;
    b.var = o.var;
    b.loglik = o.loglik;
    b.aic = o.aic;
    b.retval = o.retval;
    b.start = o.start;
    b.imean = o.imean;
    return b; 
}

// PartialSarimax test_sarimax_pointers(emscripten::val &tsInput, emscripten::val &exogInput, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose) {
//     std::vector<double> tsVec = vecFromJSArray(tsInput);
//     std::vector<double> exogVec = vecFromJSArray(exogInput);
//     double *ts = tsVec.data();
//     double *exog = exogVec.data();
//     sarimax_object* obj;
//     obj = (sarimax_object*)malloc(sizeof(sarimax_object));

//     if (nexog == 0) {
//       exog = NULL;
//     }

//     // TODO: Do we really need the following?

//     // double *phi, *theta;
//     // double *PHI, *THETA;

//     // phi = (double*)malloc(sizeof(double)* p);
//     // theta = (double*)malloc(sizeof(double)* q);
//     // PHI = (double*)malloc(sizeof(double)* P);
//     // THETA = (double*)malloc(sizeof(double)* Q);

//     *obj = sarimax_init(p, d, q, P, D, Q, s, nexog, 1, lin);

//     sarimax_setMethod(*obj, method);
//     sarimax_setOptMethod(*obj, opt);
//     sarimax_exec(*obj, ts, exog);

//     if (verbose) {
//       printf("\n SARIMAX summary: \n");
//       sarimax_summary(*obj);
//     }
//     sarimax_set o = **obj;
//     PartialSarimax b;
//     b.N = o.N;
//     b.Nused = o.Nused;
//     return b; 
// }

// PartialSarimax test_sarimax_pointers(intptr_t tsInput, intptr_t exogInput, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose) {
//     double* ts = reinterpret_cast<double*>(tsInput);
//     double* exog = reinterpret_cast<double*>(exogInput);
//     sarimax_object* obj;
//     obj = (sarimax_object*)malloc(sizeof(sarimax_object));

//     if (nexog == 0) {
//       exog = NULL;
//     }

//     // TODO: Do we really need the following?

//     // double *phi, *theta;
//     // double *PHI, *THETA;

//     // phi = (double*)malloc(sizeof(double)* p);
//     // theta = (double*)malloc(sizeof(double)* q);
//     // PHI = (double*)malloc(sizeof(double)* P);
//     // THETA = (double*)malloc(sizeof(double)* Q);

//     *obj = sarimax_init(p, d, q, P, D, Q, s, nexog, 1, lin);

//     sarimax_setMethod(*obj, method);
//     sarimax_setOptMethod(*obj, opt);
//     sarimax_exec(*obj, ts, exog);

//     if (verbose) {
//       printf("\n SARIMAX summary: \n");
//       sarimax_summary(*obj);
//     }
//     sarimax_set o = **obj;
//     PartialSarimax b;
//     b.N = o.N;
//     b.Nused = o.Nused;
//     return b; 
// }

PartialSarimax fit_sarimax (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose) {
  sarimax_object* obj;
  obj = (sarimax_object*)malloc(sizeof(sarimax_object));

  if (nexog == 0) {
    exog = NULL;
  }

  // TODO: Do we really need the following?

  // double *phi, *theta;
  // double *PHI, *THETA;

  // phi = (double*)malloc(sizeof(double)* p);
  // theta = (double*)malloc(sizeof(double)* q);
  // PHI = (double*)malloc(sizeof(double)* P);
  // THETA = (double*)malloc(sizeof(double)* Q);

  *obj = sarimax_init(p, d, q, P, D, Q, s, nexog, 1, lin);

  sarimax_setMethod(*obj, method);
  sarimax_setOptMethod(*obj, opt);
  sarimax_exec(*obj, ts, exog);

  if (verbose) {
    printf("\n SARIMAX summary: \n");
    sarimax_summary(*obj);
  }
  sarimax_set o = **obj;
  PartialSarimax b;
  b.N = o.N;
  b.Nused = o.Nused;
  return b;
}

PartialSarimax test_sarimax (int N, int Nused) {
  PartialSarimax b;
  b.N = N;
  b.Nused = Nused;
  return b;
}

double* predict_sarimax (sarimax_object* obj, double* ts, double* exog, double* newexog, int lout) {
  double *res, *amse;

  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  sarimax_predict(*obj, ts, exog, lout, newexog, res, amse);

  return res;
}

auto_arima_object* fit_autoarima (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, bool verbose) {
  auto_arima_object* obj;
  obj = (auto_arima_object*)malloc(sizeof(auto_arima_object));

  if (nexog == 0) {
    exog = NULL;
  }

  int order[3] = {p,d,q};
  int seasonal[3] = {P,D,Q};

  *obj = auto_arima_init(order, seasonal, s, nexog, lin);

  auto_arima_setApproximation(*obj, approximation);
  auto_arima_setStepwise(*obj, search);
  auto_arima_setVerbose(*obj, verbose ? 1 : 0);
  auto_arima_setMethod(*obj, method);
  auto_arima_setOptMethod(*obj, opt);

  auto_arima_exec(*obj, ts, exog);

  if (verbose) {
    printf("\n AutoARIMA summary: \n");
    auto_arima_summary(*obj);
  }

  return obj;
}

double* predict_autoarima (auto_arima_object* obj, double* ts, double* exog, double* newexog, int lout) {
  double *res, *amse;

  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  auto_arima_predict(*obj, ts, exog, lout, newexog, res, amse);

  return res;
}

EMSCRIPTEN_BINDINGS(arima) {

	// int N;// length of time series
	// int Nused;//length of time series after differencing, Nused = N - d
	// int method;
	// int optmethod;
	// int p;// size of phi
	// int d;// Number of times the series is to be differenced
	// int q;//size of theta
	// int s;// Seasonality/Period
	// int P;//Size of seasonal phi
	// int D;// The number of times the seasonal series is to be differenced
	// int Q;//size of Seasonal Theta
	// int r;// Number of exogenous variables
	// int M; // M = 0 if mean is 0.0 else M = 1
	// int ncoeff;// Total Number of Coefficients to be estimated
	// double *phi;
	// double *theta;
	// double *PHI;
	// double *THETA;
	// double *exog;
	// double *vcov;// Variance-Covariance Matrix Of length lvcov
	// int lvcov; //length of VCOV
	// double *res;
	// double mean;
	// double var;
	// double loglik;
	// double aic;
	// int retval;
	// int start;
	// int imean;
	//double params[0];
  value_object<PartialSarimax>("PartialSarimax")
      .field("N", &PartialSarimax::N)
      .field("Nused", &PartialSarimax::Nused)
      .field("method", &PartialSarimax::method)
      .field("optmethod", &PartialSarimax::optmethod)
      .field("p", &PartialSarimax::p)
      .field("d", &PartialSarimax::d)
      .field("q", &PartialSarimax::q)
      .field("s", &PartialSarimax::s)
      .field("P", &PartialSarimax::P)
      .field("D", &PartialSarimax::D)
      .field("Q", &PartialSarimax::Q)
      .field("r", &PartialSarimax::r)
      .field("M", &PartialSarimax::M)
      .field("ncoeff", &PartialSarimax::ncoeff)
      .field("phi", &PartialSarimax::phi)
      // .field("theta", &PartialSarimax::theta)
      // .field("PHI", &PartialSarimax::PHI)
      // .field("THETA", &PartialSarimax::THETA)
      // .field("exog", &PartialSarimax::exog)
      // .field("vcov", &PartialSarimax::vcov)
      // .field("lvcov", &PartialSarimax::lvcov)
      // .field("res", &PartialSarimax::res)
      .field("mean", &PartialSarimax::mean)
      .field("var", &PartialSarimax::var)
      .field("loglik", &PartialSarimax::loglik)
      .field("aic", &PartialSarimax::aic)
      .field("retval", &PartialSarimax::retval)
      .field("start", &PartialSarimax::start)
      .field("imean", &PartialSarimax::imean)
      ;
  function("fit_sarimax", &fit_sarimax, allow_raw_pointers());
  function("test_sarimax", &test_sarimax);
  register_vector<double>("DoubleVector");
  function("test_sarimax_vector", &test_sarimax_vector);
  // function("fit_sarimax", optional_override(
  // [](const cv::Mat& image, const cv::Mat& mask){
  //     double min, max;
  //     int min_idx, max_idx;
  //     cv::minMaxIdx(image, &min, &max, &min_idx, &max_idx, mask);
  //     return PartialSarimax{min, max, min_idx, max_idx};
  // }));

  // void minMaxIdx(InputArray src, double* minVal, double* maxVal, int* minIdx=0, int* maxIdx=0, InputArray mask=noArray(
  //     function("minMaxIdx", optional_override(
  //       [](const cv::Mat& image, const cv::Mat& mask){
  //           double min, max;
  //           int min_idx, max_idx;
  //           cv::minMaxIdx(image, &min, &max, &min_idx, &max_idx, mask);
  //           return minMaxIdxResult{min, max, min_idx, max_idx};
  //       }));
  // function("_sarimax_exec", &sarimax_exec, allow_raw_pointers());
}