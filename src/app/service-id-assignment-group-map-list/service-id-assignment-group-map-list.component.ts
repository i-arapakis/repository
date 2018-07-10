import { Component, OnInit, ViewChild, ViewChildren, Input, Output, EventEmitter, Inject, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ServiceID_AssignmentGroup_MapService } from '../shared/serviceID_assignmentGroup_map.service';
import { ServiceIDAssignmentGroupMap } from '../shared/serviceID_assignmentGroup_map';
import { ServiceID_AssignmentGroup_DataSource } from '../shared/ServiceID_AssignmentGroup_DataSource';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatMenuModule, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { ID } from '../shared/id';
import 'hammerjs';
import { tap } from 'rxjs/operators';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
import { DeleteDialogOverviewComponent } from '../delete-dialog-overview/delete-dialog-overview.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-service-id-assignment-group-map-list',
  templateUrl: './service-id-assignment-group-map-list.component.html',
  styleUrls: ['./service-id-assignment-group-map-list.component.css']
})
export class ServiceIdAssignmentGroupMapListComponent implements OnInit {
  displayedColumns: string[];
  serviceIDAssignmentGroupDataSource: ServiceID_AssignmentGroup_DataSource;
  newServiceID: number;
  newAssignmentGroup: string;
  selection: SelectionModel<ServiceIDAssignmentGroupMap>;
  checkMap: ServiceIDAssignmentGroupMap[];
  currentServiceID: number;
  currentAssignmentGroup: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private serviceIDAssignmentGroupMapService: ServiceID_AssignmentGroup_MapService, private toastr: ToastrService, public dialog: MatDialog) { 
    this.displayedColumns = ['select', 'serviceID', 'assignmentGroup', 'updateButton', 'deleteButton'];
    
    // if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
    //   this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
    // }

    this.serviceIDAssignmentGroupMapService.getServiceIDs();
    this.serviceIDAssignmentGroupMapService.getServiceIDAssignmentGroupMapLength();
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<ServiceIDAssignmentGroupMap>(allowMultiSelect, initialSelection);
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(
      tap(() => this.loadServiceIDAssignmentGroupMapPage())
    ).subscribe();
  }

  ngOnInit() {
    this.serviceIDAssignmentGroupDataSource = new ServiceID_AssignmentGroup_DataSource(this.serviceIDAssignmentGroupMapService);
    this.serviceIDAssignmentGroupDataSource.loadServiceIDAssignmentGroupMap('', 'asc', 1, 3);
    this.checkMap = [];
  }

  loadServiceIDAssignmentGroupMapPage(){
    // if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
    //   this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
    // }
    this.serviceIDAssignmentGroupDataSource.loadServiceIDAssignmentGroupMap('', 'asc', this.paginator.pageIndex + 1, this.paginator.pageSize);
  }

  deleteRow(x: string){
    if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
      this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      width: "50%",
      height: "30%",
      description: 'Delete Service ID - Assignment Group mapping',
      pageSize: this.paginator.pageSize,
      service: this.serviceIDAssignmentGroupMapService,
      dataSource: this.serviceIDAssignmentGroupDataSource,
      id: x,
      paginator: this.paginator
    };

    let dialogRef = this.dialog.open(DeleteDialogOverviewComponent, dialogConfig);
  }

  updateRow(serviceIDAssignmentGroupMap: ServiceIDAssignmentGroupMap){
    if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
      this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
    }
    this.serviceIDAssignmentGroupMapService.updateServiceIDAssignmentGroupMapRow(serviceIDAssignmentGroupMap)
    .subscribe(x => {
      this.serviceIDAssignmentGroupMapService.getServiceIDAssignmentGroupMapLength();
      this.serviceIDAssignmentGroupDataSource.loadServiceIDAssignmentGroupMap('', 'asc', 1, this.paginator.pageSize);

      if(x["result"].valueOf() == true){
        this.toastr.success(x["info"], "Service ID - Assignment Group Map");
      }
      else{
        this.toastr.error(x["info"], "Service ID - Assignment Group Map");
      }
  });
}

  addRow(){
    if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
      this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      width: "50%",
      height: "30%",
      description: 'New Service ID - Assignment Group mapping',
      serviceIDValue: 0,
      assignmentGroupValue: "",
      serviceIDList: this.serviceIDAssignmentGroupMapService.serviceIDList,
      pageSize: this.paginator.pageSize,
      service: this.serviceIDAssignmentGroupMapService,
      dataSource: this.serviceIDAssignmentGroupDataSource,
      paginator: this.paginator
    };

    let dialogRef = this.dialog.open(DialogOverviewComponent, dialogConfig);
  }

getCheckValue(row: ServiceIDAssignmentGroupMap){
  if(localStorage.getItem(row.ID) == 'true'){
    return true;
  } else if(localStorage.getItem(row.ID) == 'false') {
    return false;
  }
}

toggleCheck(row: ServiceIDAssignmentGroupMap){
  this.selection.toggle(row);

  if(localStorage.getItem(row.ID) == 'true'){
    localStorage.setItem(row.ID, String(false));
  } else if(localStorage.getItem(row.ID) == 'false') {
    localStorage.setItem(row.ID, String(true));
  }
}

hasValue() {
  let numSelected = 0;
  this.serviceIDAssignmentGroupDataSource.ServiceIDAssignmentGroupMap.getValue().forEach(row => {
    if(localStorage.getItem(row.ID) == 'true'){
      numSelected++;
    }
  });

  return (numSelected != 0) ? true : false;
}

isAllSelected() {
  let numSelected = 0; // all selected
  this.serviceIDAssignmentGroupDataSource.ServiceIDAssignmentGroupMap.getValue().forEach(row => {
    if(localStorage.getItem(row.ID) == 'true'){
      numSelected++;
    }
  });
  const numRows = this.serviceIDAssignmentGroupDataSource.ServiceIDAssignmentGroupMap.getValue().length; // datasource per page
  return numSelected == numRows;
}

masterToggle() {
  this.isAllSelected() ?
      this.serviceIDAssignmentGroupDataSource.ServiceIDAssignmentGroupMap.getValue().forEach(row => { this.selection.deselect(row);
        localStorage.setItem(row.ID, String(false));
      }) :
      this.serviceIDAssignmentGroupDataSource.ServiceIDAssignmentGroupMap.getValue().forEach(row => { this.selection.select(row);
        localStorage.setItem(row.ID, String(true));
      });
}

updateSelected(){
  if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
    this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
  }

  let ServiceIDAssignmentGroupMapList = new Array<ServiceIDAssignmentGroupMap>();

  this.serviceIDAssignmentGroupDataSource.ServiceIDAssignmentGroupMap.getValue().forEach(row => {
    if(localStorage.getItem(row.ID) == 'true') {
      row.LastUpdate = new Date(Date.now());
      ServiceIDAssignmentGroupMapList.push(row);
    }
  });

  this.serviceIDAssignmentGroupMapService.updateServiceIDAssignmentGroupMapRows(ServiceIDAssignmentGroupMapList).subscribe(x => {
    this.serviceIDAssignmentGroupMapService.getServiceIDAssignmentGroupMapLength();
    this.serviceIDAssignmentGroupDataSource.loadServiceIDAssignmentGroupMap('', 'asc', 1, this.paginator.pageSize);

    if(x["result"].valueOf() == true){
      this.toastr.success(x["info"], "Service ID - Assignment Group Map");
    }
    else{
      this.toastr.error(x["info"], "Service ID - Assignment Group Map");
    }
  })
}

deleteSelected() {
  if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
    this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
  }

  let guidList = new Array<string>();

  this.serviceIDAssignmentGroupDataSource.ServiceIDAssignmentGroupMap.getValue().forEach(row => {
    if(localStorage.getItem(row.ID) == 'true') {
      guidList.push(row.ID);
    }
  });

  this.serviceIDAssignmentGroupMapService.deleteServiceIDAssignmentGroupMapRows(guidList).subscribe(x => {
    this.serviceIDAssignmentGroupMapService.getServiceIDAssignmentGroupMapLength();
    this.serviceIDAssignmentGroupDataSource.loadServiceIDAssignmentGroupMap('', 'asc', 1, this.paginator.pageSize);

    if(x["result"].valueOf() == true){
      this.toastr.success(x["info"], "Service ID - Assignment Group Map");
    }
    else{
      this.toastr.error(x["info"], "Service ID - Assignment Group Map");
    }

    this.paginator.firstPage();
  })
}

exportTable() {
  if(!this.serviceIDAssignmentGroupMapService.validateUserToken()) {
    this.serviceIDAssignmentGroupMapService.redirectoToLoginPage();
  }

  this.serviceIDAssignmentGroupMapService.exportToExcel()
  .subscribe(result => {
    this.downloadFile(result,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'export.xlsx')
  });
}

downloadFile(blob: any, type: string, filename: string) {

  var binaryData = [];
  binaryData.push(blob);

  const url = window.URL.createObjectURL(new Blob(binaryData)); // <-- work with blob directly

   // create hidden dom element (so it works in all browsers)
   const a = document.createElement('a');
   a.setAttribute('style', 'display:none;');
   document.body.appendChild(a);

   // create file, attach to hidden element and open hidden element
   a.href = url;
   a.download = filename;
   a.click();
}

}
