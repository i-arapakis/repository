import { Component } from '@angular/core';
import { DataSource } from "@angular/cdk/table";
import { ServiceIDAssignmentGroupMap } from './serviceID_assignmentGroup_map';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { CollectionViewer } from '@angular/cdk/collections';
import { ServiceID_AssignmentGroup_MapService } from '../shared/serviceID_assignmentGroup_map.service';
import { finalize, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Page } from './page';

export class ServiceID_AssignmentGroup_DataSource implements DataSource<ServiceIDAssignmentGroupMap> {
    
    public ServiceIDAssignmentGroupMap = new BehaviorSubject<ServiceIDAssignmentGroupMap[]>([]);
    private loadingServiceIDAssignmentGroupMap = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingServiceIDAssignmentGroupMap.asObservable();

    constructor(private serviceIDAssignmentGroupMapService: ServiceID_AssignmentGroup_MapService){}


    connect(collectionViewer: CollectionViewer): Observable<ServiceIDAssignmentGroupMap[]> {
        return this.ServiceIDAssignmentGroupMap.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.ServiceIDAssignmentGroupMap.complete();
        this.loadingServiceIDAssignmentGroupMap.complete();
    }

    loadServiceIDAssignmentGroupMap(filter = '',
    sortDirection = 'asc', pageIndex = 1, pageSize = 3){
        if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
            this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
        }
        let page : Page = { Page : pageIndex, PageSize : pageSize };
        this.loadingServiceIDAssignmentGroupMap.next(true);
        this.serviceIDAssignmentGroupMapService.getServiceIDAssignmentGroupMap(page)
        .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingServiceIDAssignmentGroupMap.next(false))
        )
        .subscribe((x:any[]) => { this.ServiceIDAssignmentGroupMap.next(x["ServiceIDAssignmentGroupMap"]);
        this.ServiceIDAssignmentGroupMap.getValue().forEach(row => {
            if(localStorage.getItem(row.ID) == null){
                localStorage.setItem(row.ID, String(false)); } }) //checkboxes initialization
    });
}


}