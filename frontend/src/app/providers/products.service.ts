import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import Axios from 'axios';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public userLoggedIn: any = {};
  public iUser: any = {};
  private backendUserResponse = false;
  public subjectProducts = new BehaviorSubject(null);
  public token = new BehaviorSubject('');
  public loading = false;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.checkToken(user).then(res => {
          if (res) {
            Object.assign(this.iUser, res)
          }
        });
        console.log('uuuuuser', this.iUser)
      } else {
        return;
      }
      this.userLoggedIn.name = user.displayName;
      this.userLoggedIn.uId = user.uid;
      this.userLoggedIn.image = user.photoURL
    });
  }

  set subjectDataProducts(value) {
    this.subjectProducts.next(value);
  }

  get subjectDataProducts() {
    return this.subjectProducts.getValue();
  }

  async checkToken(params: any): Promise<any> {
    if (!params) {
      return;
    }

    this.token.next(params.ma);
    const options = {
      headers: {
        Authorization: `Bearer ${params.ma}`,
        'Content-Type': 'application/json'
      }
    };
    let userRequest;
    try {
      userRequest = await Axios.get('http://localhost:3000/api/checkToken', options);
      this.backendUserResponse = true;
    } catch (e) {
      userRequest = null;
    }
    return userRequest ? userRequest.data.payload : userRequest;
  }

  login(provider?: string) {
    if (provider === 'google') {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
    if (provider === 'twitter') {
      this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }
  }

  logout() {
    this.subjectProducts.next(null)
    this.userLoggedIn = {};
    this.afAuth.auth.signOut();
  }

  async fetchDataProducts() {
    const options = {
      headers: {
        Authorization: `Bearer ${this.token.getValue()}`,
        'Content-Type': 'application/json'
      }
    };
    let userRequest;
    try {
      this.loading = true;
      userRequest = await Axios.get('http://localhost:3000/api/products', options);
      this.backendUserResponse = true;
    } catch (e) {
      userRequest = null;
      this.loading = false;
    }
    this.loading = false;
    return userRequest ? await userRequest.data : userRequest;
  }

}
