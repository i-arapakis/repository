import { Injectable } from '@angular/core';
import { ServiceIDAssignmentGroupMap } from './serviceID_assignmentGroup_map';
import { DeleteServiceIDAssignmentGroupMapRowResponse } from './DeleteServiceIDAssignmentGroupMapRowResponse';
import { DeleteServiceIDAssignmentGroupMapRowsResponse } from './DeleteServiceIDAssignmentGroupMapRowsResponse';
import { Page } from './page';
import { ID } from './id';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { catchError, map, tap, mergeMap } from 'rxjs/operators';
import { Response, Headers, RequestOptions, RequestMethod, ResponseType, ResponseContentType } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { extend } from 'webdriver-js-extender';
import { merge } from 'merge-json';
import { type } from 'os';
import { AppComponent } from '../app.component';
import { DatePipe } from '@angular/common';


@Injectable()
export class ServiceID_AssignmentGroup_MapService {
    serviceID_assignmentGroup_mapList: ServiceIDAssignmentGroupMap[];
    serviceIDList: number[];
    serviceID_assignmentGroup_mapList_Length: number;

constructor(private httpClient: HttpClient, private appComponent: AppComponent){
}

getServiceIDs(){
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })};
        
        this.httpClient.get('http://localhost/HPSmartContactAdministration/api/HPSCAdmin/getAllServiceIDs', httpOptions)
        .map(res => {
            return res["response"];
        }).toPromise().then(x => {
            this.serviceIDList = x["serviceIDList"];
        })
    }

getServiceIDAssignmentGroupMap(page :Page):  Observable<ServiceIDAssignmentGroupMap> {
    let transform = Object.assign(page, {"ServiceIDAssignmentGroupMap":map});
    let payload = JSON.stringify(transform);
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })};
        return this.httpClient.post('http://localhost/HPSmartContactAdministration/api/HPSCAdmin/getServiceIDAssignmentGroupMap', transform, httpOptions)
        .map(res => res["response"]);
    }

getServiceIDAssignmentGroupMapLength() {
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })};
        this.httpClient.get('http://localhost/HPSmartContactAdministration/api/HPSCAdmin/getServiceIDAssignmentGroupMapLength', httpOptions)
        .map(res => {
            return res["response"];
        }).toPromise().then(x => {
            this.serviceID_assignmentGroup_mapList_Length = x["length"];
        })
    }

addServiceIDAssignmentGroupMapRow(ServiceIDAssignmentGroupMap: ServiceIDAssignmentGroupMap): Observable<boolean> {
    let transform = {"ServiceIDAssignmentGroupMap": ServiceIDAssignmentGroupMap};
    let payload = JSON.stringify(transform);
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })};

        return this.httpClient.post('http://localhost/HPSmartContactAdministration/api/HPSCAdmin/addServiceIDAssignmentGroupMapRow', payload, httpOptions)
        .map(res => res["response"]);
    }

updateServiceIDAssignmentGroupMapRow(ServiceIDAssignmentGroupMap: ServiceIDAssignmentGroupMap): Observable<boolean> {
    let transform = {"ServiceIDAssignmentGroupMap": ServiceIDAssignmentGroupMap};
    let payload = JSON.stringify(transform);
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })};

        return this.httpClient.put('http://localhost/HPSmartContactAdministration/api/HPSCAdmin/updateServiceIDAssignmentGroupMapRow', payload, httpOptions)
        .map(res => res["response"]);
    }

updateServiceIDAssignmentGroupMapRows(ServiceIDAssignmentGroupMapList: Array<ServiceIDAssignmentGroupMap>): Observable<boolean> {
    let transform = {"ServiceIDAssignmentGroupMapList":ServiceIDAssignmentGroupMapList};
    let payload = JSON.stringify(transform);
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })};

        return this.httpClient.put('http://localhost/HPSmartContactAdministration/api/HPSCAdmin/updateServiceIDAssignmentGroupMapRows', payload, httpOptions)
        .map(res => res["response"]);
    }

deleteServiceIDAssignmentGroupMapRow(id: ID): Observable<boolean> {
    let payload = JSON.stringify(id);
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })};

        return this.httpClient.post('http://localhost/HPSmartContactAdministration/api/HPSCAdmin/deleteServiceIDAssignmentGroupMapRow', payload, httpOptions)
        .map(res => res["response"]);
    }


deleteServiceIDAssignmentGroupMapRows(guidList: Array<string>): Observable<boolean> {
    let transform = {"guidList":guidList};
    let payload = JSON.stringify(transform);
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })};

        return this.httpClient.post('http://localhost/HPSmartContactAdministration/api/HPSCAdmin/deleteServiceIDAssignmentGroupMapRows', payload, httpOptions)
        .map(res => res["response"]);
    }

exportToExcel(): Observable<any> {
    return new Observable(obs => {
        var oReq = new XMLHttpRequest();
        oReq.open('POST', 'http://localhost/HPSmartContactAdministration/api/HPSCAdmin/exportToExcel', true);
        oReq.setRequestHeader('content-type', 'application/json');
        oReq.setRequestHeader('authorization', localStorage.getItem('userToken'));
        oReq.responseType = 'arraybuffer';

        oReq.onload = function (oEvent) {
            var arrayBuffer = oReq.response;
            var byteArray = new Uint8Array(arrayBuffer);
            obs.next(byteArray);
        }

        oReq.send();
    });
}

validateUserToken() {
    if(!localStorage.getItem('AuthenticatedUser')) {
        return false;
    } else {
        let datePipe = new DatePipe('en-US');
        let authUser = JSON.parse(localStorage.getItem('AuthenticatedUser'));
        let currentTime = datePipe.transform(new Date().toString(), 'dd/MM/yyyy HH:mm:ss');
        //let currentTime = new Date();
        let validTo = datePipe.transform(authUser['ValidTo'], 'dd/MM/yyyy HH:mm:ss');
        //let validTo = new Date(authUser['ValidTo']);
        if(currentTime > validTo) {
            return false;
        }
    }

    return true;
}

redirectoToLoginPage() {
    this.appComponent.appRouter.navigate(['/login']);
    this.appComponent.loggedIn = false;
}

}