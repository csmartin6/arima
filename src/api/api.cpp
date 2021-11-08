#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include "api.h"
#include "../../ctsa/header/ctsa.h"
#include <vector>
#ifdef EMSCRIPTEN
#include <emscripten/bind.h>
#endif


CompiledModel SarimaxObject2CompiledModel(sarimax_object* obj, std::vector<double> tsVec, std::vector<double> exogVec) {
  sarimax_set o = **obj;
  CompiledModel model;
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
  model.exog = exogVec;
  std::vector<double> vcovVec(o.vcov, o.vcov+o.lvcov);
  model.vcov = vcovVec;
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

  model.ts = tsVec;
  return model;
}

sarimax_object* CompiledModel2SarimaxObject(CompiledModel model) {
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
    for (int i = 0; i < model.lvcov; ++i) {
        (*obj)->vcov[i] = model.vcov[i];
    }
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
CompiledModel AutoArimaObject2CompiledModel(auto_arima_object* obj, std::vector<double> tsVec, std::vector<double> exogVec){
  auto_arima_set o = **obj;
  CompiledModel model;
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
  // std::vector<double> exogVec(o.exog, o.exog+o.N*o.r);
  model.exog = exogVec;
  std::vector<double> vcovVec(o.vcov, o.vcov+o.lvcov);
  model.vcov = vcovVec;
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
  model.ts = tsVec;
  return model;
}


CompiledModel fit(std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, bool verbose) {
    double *ts = tsVec.data();
    double *exog = exogVec.data();
    sarimax_object* obj;
    obj = (sarimax_object*)malloc(sizeof(sarimax_object));

    if (nexog == 0) {
      exog = NULL;
    }

    *obj = sarimax_init(p, d, q, P, D, Q, s, nexog, 1, lin);

    sarimax_setMethod(*obj, method);
    sarimax_setOptMethod(*obj, opt);
    sarimax_exec(*obj, ts, exog);

    if (verbose) {
      printf("\n SARIMAX summary (fit): \n");
      sarimax_summary(*obj);
    }
    return SarimaxObject2CompiledModel(obj, tsVec, exogVec);
}
CompiledModel autofit (std::vector<double> tsVec, std::vector<double> exogVec, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, bool verbose) {
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

  return AutoArimaObject2CompiledModel(obj, tsVec, exogVec);
}

std::vector<double> predict (CompiledModel model, std::vector<double> newexogVec, int lout) {
  double *res, *amse;
  double *ts = model.ts.data();
  double *exog = model.exog.data();
  double *newexog = newexogVec.data();
  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  sarimax_object* obj = CompiledModel2SarimaxObject(model);
  sarimax_predict(*obj, ts, exog, lout, newexog, res, amse);
  std::vector<double> toReturn(res, res+lout * 2);
  return toReturn;
}


#ifdef EMSCRIPTEN
  using namespace emscripten;
  EMSCRIPTEN_BINDINGS(arima) {
    value_object<CompiledModel>("CompiledModelCpp")
        .field("N", &CompiledModel::N)
        .field("Nused", &CompiledModel::Nused)
        .field("method", &CompiledModel::method)
        .field("optmethod", &CompiledModel::optmethod)
        .field("p", &CompiledModel::p)
        .field("d", &CompiledModel::d)
        .field("q", &CompiledModel::q)
        .field("s", &CompiledModel::s)
        .field("P", &CompiledModel::P)
        .field("D", &CompiledModel::D)
        .field("Q", &CompiledModel::Q)
        .field("r", &CompiledModel::r)
        .field("M", &CompiledModel::M)
        .field("ncoeff", &CompiledModel::ncoeff)
        .field("phi", &CompiledModel::phi)
        .field("theta", &CompiledModel::theta)
        .field("PHI", &CompiledModel::PHI)
        .field("THETA", &CompiledModel::THETA)
        .field("exog", &CompiledModel::exog)
        .field("vcov", &CompiledModel::vcov)
        .field("lvcov", &CompiledModel::lvcov)
        .field("res", &CompiledModel::res)
        .field("mean", &CompiledModel::mean)
        .field("var", &CompiledModel::var)
        .field("loglik", &CompiledModel::loglik)
        .field("aic", &CompiledModel::aic)
        .field("retval", &CompiledModel::retval)
        .field("start", &CompiledModel::start)
        .field("imean", &CompiledModel::imean)
        .field("ts", &CompiledModel::ts)
        ;
    register_vector<double>("DoubleVector");
    function("fit", &fit);
    function("predict", &predict);
    function("autofit", &autofit);
}
#endif
