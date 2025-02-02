import {Action} from "redux";
import {SagaIterator, SagaMiddleware} from "redux-saga";
import {Exception} from "./util/exception";
import {Store} from "redux";
export interface BaseAppView<H = any, R = any> {
    readonly history?: H; // use in website
    readonly store: Store<BaseStateView<R>>;
    readonly sagaMiddleware: SagaMiddleware<any>;
    readonly actionHandler: {[type: string]: ActionHandler};
    readonly modules: {[module: string]: number};
    exceptionHandler: ExceptionHandler;
}

export interface BaseStateView<R = any> {
    router?: R; // use in website
    loading: LoadingStateView;
    app: {};
}

export abstract class BaseModelLifeCycle {
    abstract onReady(): SagaIterator;
    abstract onLoad(): SagaIterator;
    abstract onUnload(): SagaIterator;
    abstract onHide(): SagaIterator;
}

export abstract class BaseModelProperty<State> {
    abstract readonly moduleName: string;
    abstract readonly initState: State;
    abstract state: Readonly<State>;
    abstract rootState: Readonly<BaseStateView>;
    abstract setState(newState: Partial<State>): void;
    abstract setHistory?(url: string): void; // use in website
}

export type BaseModel<State> = BaseModelProperty<State> & BaseModelLifeCycle;

export interface StateActionPayloadView {
    module: string;
    state: any;
}

export interface ActionTypeView<P> extends Action {
    name?: string;
    payload: P;
}

export interface LoadingActionView {
    identifier: string;
    hasShow: boolean;
}

export interface LoadingStateView {
    [loading: string]: number; // there may be multiple effects listen to it, hide loading component when status === 0
}

export type ActionHandler = (...args: any[]) => SagaIterator;

export type ErrorHandler = (error: Exception) => SagaIterator;

export interface ExceptionHandler {
    onError: ErrorHandler;
}
