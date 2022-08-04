import { makeAutoObservable } from "mobx"

export default class UserStore {
  constructor() {
    this._isAuth = false
    this._user = {}
    this._isBlock = false
    makeAutoObservable(this)
  }
  setIsAuth(bool) {
    this._isAuth = bool
  }
  setUser(user) {
    this._user = user
  }
  setIsBlock(bool) {
    this._isBlock = bool
  }
  get isAuth() {
    return this._isAuth
  }
  get user() {
    return this._user
  }
  get isBlock() {
    return this._isBlock
  }
}