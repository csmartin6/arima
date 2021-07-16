#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include "api.h"
#include "../../ctsa/header/ctsa.h"
#include <vector>
#ifdef EMSCRIPTEN
#include <emscripten/bind.h>
#endif

// todo(cmartin) AutoArima and sarimax should return the same object 

CompiledSarimax SarimaxObject2CompiledSarimax(sarimax_object* obj) {
  sarimax_set o = **obj;
  CompiledSarimax model;
  model.N = o.N;
  model.Nused = o.Nused;
  model.method = o.method;
  model.optmethod = o.optmethod;
  model.p = o.p;
  model.d = o.d;
  model.q = o.q;
  model.s = o.s;
  model.P = o.P;
  model.D = o.D;
  model.Q = o.Q;
  model.r = o.r;
  model.M = o.M;
  model.ncoeff = o.ncoeff;
  std::vector<double> phiVec(o.phi, o.phi+o.p);
  model.phi = phiVec;
  std::vector<double> thetaVec(o.theta, o.theta+o.q);
  model.theta = thetaVec;
  std::vector<double> PHIVec(o.PHI, o.PHI+o.P);
  model.PHI = PHIVec;
  std::vector<double> THETAVec(o.THETA, o.THETA+o.Q);
  model.THETA = THETAVec;
  // b.exog = o.exog;
  // b.vcov = o.vcov;
  model.lvcov = o.lvcov;
  std::vector<double> resVec(o.res, o.res+o.Nused);
  model.res = resVec;
  model.mean = o.mean;
  model.var = o.var;
  model.loglik = o.loglik;
  model.aic = o.aic;
  model.retval = o.retval;
  model.start = o.start;
  model.imean = o.imean;
  return model; 
}

sarimax_object* CompiledSarimax2SarimaxObject(CompiledSarimax model) {
    sarimax_object* obj;
    obj = (sarimax_object*)malloc(sizeof(sarimax_object));
    *obj = sarimax_init(model.p, model.d, model.q, model.P, model.D, model.Q, model.s, model.r, model.imean, model.N);
    (*obj) ->N = model.N;
    (*obj) -> Nused = model.Nused;
    (*obj) -> method = model.method;
    (*obj) -> optmethod = model.optmethod;
    (*obj) -> p = model.p;
    (*obj) -> d = model.d;
    (*obj) -> q = model.q;
    (*obj) -> s = model.s;
    (*obj) -> P = model.P;
    (*obj) -> D = model.D;
    (*obj) -> Q = model.Q;
    (*obj) -> r = model.r;
    (*obj) -> M = model.M;
    (*obj) -> ncoeff = model.ncoeff;
    // (*obj) -> phi = model.phi.data();
		for (int i = 0; i < model.p; ++i) {
			(*obj)->phi[i] = model.phi[i];
		}
    for (int i = 0; i < model.q; ++i) {
			(*obj)->theta[i] = model.theta[i];
		}
    for (int i = 0; i < model.P; ++i) {
			(*obj)->PHI[i] = model.PHI[i];
		}
    for (int i = 0; i < model.Q; ++i) {
			(*obj)->THETA[i] = model.THETA[i];
		}
    // obj ->  // b.exog = o.exog;
    // obj ->  // b.vcov = o.vcov;
    (*obj) ->  lvcov = model.lvcov;
    for (int i = 0; i < model.Nused; ++i) {
			(*obj)->res[i] = model.res[i];
		}
    (*obj) ->  mean = model.mean;
    (*obj) ->  var = model.var;
    (*obj) ->  loglik = model.loglik;
    (*obj) ->  aic = model.aic;
    (*obj) ->  retval = model.retval;
    (*obj) ->  start = model.start;
    (*obj) ->  imean = model.imean;
    return obj; 
}

CompiledAutoArima AutoArimaObject2CompiledAutoArima(auto_arima_object* obj){
  auto_arima_set o = **obj;
  CompiledAutoArima model;
  model.N = o.N;
  model.Nused = o.Nused;
  model.method = o.method;
  model.optmethod = o.optmethod;
  model.p = o.p;
  model.d = o.d;
  model.q = o.q;
  model.s = o.s;
  model.P = o.P;
  model.D = o.D;
  model.Q = o.Q;
  model.r = o.r;
  model.M = o.M;
  model.ncoeff = o.ncoeff;
  std::vector<double> phiVec(o.phi, o.phi+o.p);
  model.phi = phiVec;
  std::vector<double> thetaVec(o.theta, o.theta+o.q);
  model.theta = thetaVec;
  std::vector<double> PHIVec(o.PHI, o.PHI+o.P);
  model.PHI = PHIVec;
  std::vector<double> THETAVec(o.THETA, o.THETA+o.Q);
  model.THETA = THETAVec;
  // b.exog = o.exog;
  // b.vcov = o.vcov;
  model.lvcov = o.lvcov;
  std::vector<double> resVec(o.res, o.res+o.Nused);
  model.res = resVec;
  model.mean = o.mean;
  model.var = o.var;
  model.loglik = o.loglik;
  model.aic = o.aic;
  model.retval = o.retval;
  model.start = o.start;
  model.imean = o.imean;
	model.idrift = o.idrift;
  model.retval = o.retval;
	model.start = o.start;
	model.imean = o.imean;
	model.idrift = o.idrift;
	model.stationary = o.stationary;
	model.seasonal = o.seasonal;
	model.Order_max = o.Order_max;
	model.p_start = o.p_start;
	model.q_start = o.q_start;
	model.P_start = o.P_start;
	model.Q_start = o.Q_start;
  std::string information_criteria =(o.information_criteria);
	model.information_criteria = information_criteria;
	model.stepwise = o.stepwise;
	model.num_models = o.num_models;
	model.approximation = o.approximation;
	model.verbose = o.verbose;
  std::string test(o.test);
  model.test = test;
  std::string type(o.type);
  model.type = type;
  std::string seas(o.seas);
  model.seas = seas;
	model.alpha_test = o.alpha_test;
	model.alpha_seas = o.alpha_seas;
	model.lambda = o.lambda;
	model.sigma2 = o.sigma2;
	model.aic = o.aic;
	model.bic = o.bic;
	model.aicc = o.aicc;
	// model.params[0] = o.params[0];
  return model; 
}

auto_arima_object* CompiledAutoArima2AutoArimaObject(CompiledAutoArima model){
  auto_arima_object* obj;
  obj = (auto_arima_object*)malloc(sizeof(auto_arima_object));
(*obj) ->N = model.N;
  (*obj) -> Nused = model.Nused;
  (*obj) -> method = model.method;
  (*obj) -> optmethod = model.optmethod;
  (*obj) -> p = model.p;
  (*obj) -> d = model.d;
  (*obj) -> q = model.q;
  (*obj) -> s = model.s;
  (*obj) -> P = model.P;
  (*obj) -> D = model.D;
  (*obj) -> Q = model.Q;
  (*obj) -> r = model.r;
  (*obj) -> M = model.M;
  (*obj) -> ncoeff = model.ncoeff;
  // (*obj) -> phi = model.phi.data();
  for (int i = 0; i < model.p; ++i) {
    (*obj)->phi[i] = model.phi[i];
  }
  for (int i = 0; i < model.q; ++i) {
    (*obj)->theta[i] = model.theta[i];
  }
  for (int i = 0; i < model.P; ++i) {
    (*obj)->PHI[i] = model.PHI[i];
  }
  for (int i = 0; i < model.Q; ++i) {
    (*obj)->THETA[i] = model.THETA[i];
  }
  // obj ->  // b.exog = o.exog;
  // obj ->  // b.vcov = o.vcov;
  (*obj) ->  lvcov = model.lvcov;
  for (int i = 0; i < model.Nused; ++i) {
    (*obj)->res[i] = model.res[i];
  }
  (*obj) ->  mean = model.mean;
  (*obj) ->  var = model.var;
  (*obj) ->  loglik = model.loglik;
  (*obj) ->  aic = model.aic;
  (*obj) ->  retval = model.retval;
  (*obj) ->  start = model.start;
  (*obj) ->  imean = model.imean;
  (*obj) -> idrift = model.idrift;
	(*obj) -> stationary = model.stationary;
	(*obj) -> seasonal = model.seasonal;
	(*obj) -> Order_max = model.Order_max;
	(*obj) -> p_start = model.p_start;
	(*obj) -> q_start = model.q_start;
	(*obj) -> P_start = model.P_start;
	(*obj) -> Q_start = model.Q_start;
  for (int i = 0; i < 10; ++i) {
    (*obj)->information_criteria[i] = model.information_criteria[i];
  }
	(*obj) -> stepwise = model.stepwise;
	(*obj) -> num_models = model.num_models;
	(*obj) -> approximation = model.approximation;
	(*obj) -> verbose = model.verbose;
  for (int i = 0; i < 10; ++i) {
    (*obj)->test[i] = model.test[i];
  }
  for (int i = 0; i < 10; ++i) {
    (*obj)->type[i] = model.type[i];
  }
  for (int i = 0; i < 10; ++i) {
    (*obj)->seas[i] = model.seas[i];
  }
	(*obj) -> alpha_test = model.alpha_test;
	(*obj) -> alpha_seas = model.alpha_seas;
	(*obj) -> lambda = model.lambda;
	(*obj) -> sigma2 = model.sigma2;
	(*obj) -> aic = model.aic;
	(*obj) -> bic = model.bic;
	(*obj) -> aicc = model.aicc;
	// (*obj) -> params[0] =model.params[0];
  return obj;
}

CompiledSarimax fit_sarimax(std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose) {
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
      printf("\n SARIMAX summary (fit_sarimax_vector): \n");
      sarimax_summary(*obj);
    }
    return SarimaxObject2CompiledSarimax(obj); 
}

sarimax_object* fit_sarimax_old (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose) {
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
    printf("\n SARIMAX summary (fit_sarimax): \n");
    sarimax_summary(*obj);
  }
  return obj;
}

double* predict_sarimax_old (sarimax_object* obj, double* ts, double* exog, double* newexog, int lout) {
  double *res, *amse;

  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  sarimax_predict(*obj, ts, exog, lout, newexog, res, amse);
  return res;
}

std::vector<double> predict_sarimax (CompiledSarimax model, std::vector<double> tsVec, std::vector<double> exogVec, std::vector<double> newexogVec, int lout) {
  double *res, *amse;
  double *ts = tsVec.data();
  double *exog = exogVec.data();
  double *newexog = newexogVec.data();
  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  sarimax_object* obj = CompiledSarimax2SarimaxObject(model);
  sarimax_predict(*obj, ts, exog, lout, newexog, res, amse);
  std::vector<double> toReturn(res, res+lout * 2);
  return toReturn;
}

auto_arima_object* fit_autoarima_old (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, bool verbose) {
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

double* predict_autoarima_old (auto_arima_object* obj, double* ts, double* exog, double* newexog, int lout) {
  double *res, *amse;

  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  auto_arima_predict(*obj, ts, exog, lout, newexog, res, amse);

  return res;
}

CompiledAutoArima fit_autoarima (std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, bool verbose) {
  auto_arima_object* obj;
  obj = (auto_arima_object*)malloc(sizeof(auto_arima_object));

  double *ts = tsVec.data();
  double *exog = exogVec.data();
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

  return AutoArimaObject2CompiledAutoArima(obj);
}

std::vector<double> predict_autoarima (CompiledAutoArima model, std::vector<double> tsVec, std::vector<double> exogVec, std::vector<double> newexogVec, int lout) {
  double *res, *amse;
  double *ts = tsVec.data();
  double *exog = exogVec.data();
  double *newexog = newexogVec.data();
  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  auto_arima_object* obj = CompiledAutoArima2AutoArimaObject(model);
  auto_arima_predict(*obj, ts, exog, lout, newexog, res, amse);
  std::vector<double> toReturn(res, res+lout * 2);
  return toReturn;
}


#ifdef EMSCRIPTEN
  using namespace emscripten;
  EMSCRIPTEN_BINDINGS(arima) {
    value_object<CompiledSarimax>("CompiledSarimaxCpp")
        .field("N", &CompiledSarimax::N)
        .field("Nused", &CompiledSarimax::Nused)
        .field("method", &CompiledSarimax::method)
        .field("optmethod", &CompiledSarimax::optmethod)
        .field("p", &CompiledSarimax::p)
        .field("d", &CompiledSarimax::d)
        .field("q", &CompiledSarimax::q)
        .field("s", &CompiledSarimax::s)
        .field("P", &CompiledSarimax::P)
        .field("D", &CompiledSarimax::D)
        .field("Q", &CompiledSarimax::Q)
        .field("r", &CompiledSarimax::r)
        .field("M", &CompiledSarimax::M)
        .field("ncoeff", &CompiledSarimax::ncoeff)
        .field("phi", &CompiledSarimax::phi)
        .field("theta", &CompiledSarimax::theta)
        .field("PHI", &CompiledSarimax::PHI)
        .field("THETA", &CompiledSarimax::THETA)
        // .field("exog", &CompiledSarimax::exog)
        // .field("vcov", &CompiledSarimax::vcov)
        .field("lvcov", &CompiledSarimax::lvcov)
        .field("res", &CompiledSarimax::res)
        .field("mean", &CompiledSarimax::mean)
        .field("var", &CompiledSarimax::var)
        .field("loglik", &CompiledSarimax::loglik)
        .field("aic", &CompiledSarimax::aic)
        .field("retval", &CompiledSarimax::retval)
        .field("start", &CompiledSarimax::start)
        .field("imean", &CompiledSarimax::imean)
        ;
      value_object<CompiledAutoArima>("CompiledAutoArimaCpp")
        .field("N", &CompiledAutoArima::N)
        .field("Nused", &CompiledAutoArima::Nused)
        .field("method", &CompiledAutoArima::method)
        .field("optmethod", &CompiledAutoArima::optmethod)
        .field("p", &CompiledAutoArima::p)
        .field("d", &CompiledAutoArima::d)
        .field("q", &CompiledAutoArima::q)
        .field("s", &CompiledAutoArima::s)
        .field("P", &CompiledAutoArima::P)
        .field("D", &CompiledAutoArima::D)
        .field("Q", &CompiledAutoArima::Q)
        .field("r", &CompiledAutoArima::r)
        .field("M", &CompiledAutoArima::M)
        .field("ncoeff", &CompiledAutoArima::ncoeff)
        .field("phi", &CompiledAutoArima::phi)
        .field("theta", &CompiledAutoArima::theta)
        .field("PHI", &CompiledAutoArima::PHI)
        .field("THETA", &CompiledAutoArima::THETA)
        // .field("exog", &CompiledAutoArima::exog)
        // .field("vcov", &CompiledAutoArima::vcov)
        .field("lvcov", &CompiledAutoArima::lvcov)
        .field("res", &CompiledAutoArima::res)
        .field("mean", &CompiledAutoArima::mean)
        .field("var", &CompiledAutoArima::var)
        .field("loglik", &CompiledAutoArima::loglik)
        .field("aic", &CompiledAutoArima::aic)
        .field("retval", &CompiledAutoArima::retval)
        .field("start", &CompiledAutoArima::start)
        .field("imean", &CompiledAutoArima::imean);
    register_vector<double>("DoubleVector");
    function("fit_sarimax", &fit_sarimax);
    function("predict_sarimax", &predict_sarimax);
    function("fit_autoarima", &fit_autoarima);
    function("predict_autoarima", &predict_autoarima);
  // function("fit_sarimax", optional_override(
  // [](const cv::Mat& image, const cv::Mat& mask){
  //     double min, max;
  //     int min_idx, max_idx;
  //     cv::minMaxIdx(image, &min, &max, &min_idx, &max_idx, mask);
  //     return CompiledSarimax{min, max, min_idx, max_idx};
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
#endif