import { Component, OnInit, Inject, forwardRef, HostBinding, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ServiceID_AssignmentGroup_MapService } from '../shared/serviceID_assignmentGroup_map.service';
import { ServiceID_AssignmentGroup_DataSource } from '../shared/ServiceID_AssignmentGroup_DataSource';
import { FormsModule, Validators } from '@angular/forms';
import { ServiceIDAssignmentGroupMap } from '../shared/serviceID_assignmentGroup_map';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  styleUrls: ['./dialog-overview.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DialogOverviewComponent),
      multi: true
    }
  ]
})
export class DialogOverviewComponent {

  serviceIDAssignmentGroupDataSource: ServiceID_AssignmentGroup_DataSource;
  form: FormGroup;
  description:string;
  serviceIDList: number[];
  pageSize: number;
  service: ServiceID_AssignmentGroup_MapService;
  dataSource: ServiceID_AssignmentGroup_DataSource;
  paginator: MatPaginator;

  private newSvcID: number;
  private newAssGr: string;
  private ServiceIDAssignmentGroupMap: ServiceIDAssignmentGroupMap;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) data, private toastr: ToastrService) {
      this.description = data.description;
      this.serviceIDList = data.serviceIDList;
      this.form = this.fb.group({
        description: [this.description, []],
        serviceID: [null, Validators.required],
        assignmentGroup: [null, Validators.required]
      });
      this.pageSize = data.pageSize;
      this.service = data.service;
      this.dataSource = data.dataSource;
      this.paginator = data.paginator;
    }

    get newServiceID(): number {
      return this.newSvcID;
    };

    set newServiceID(v: number){
      if(v != this.newSvcID)
      {
        this.newSvcID = v;
      }
    }

    get newAssignmentGroup(): string {
      return this.newAssGr;
    };

    set newAssignmentGroup(v: string){
      if(v != this.newAssGr)
      {
        this.newAssGr = v;
      }
    }
    

    save() {
      this.ServiceIDAssignmentGroupMap = new ServiceIDAssignmentGroupMap('00000000-0000-0000-0000-000000000000', this.newSvcID, this.newAssGr, new Date(Date.now()), false, false);

      this.service.addServiceIDAssignmentGroupMapRow(this.ServiceIDAssignmentGroupMap)
      .subscribe(x => {
        this.service.getServiceIDAssignmentGroupMapLength();
        this.dataSource.loadServiceIDAssignmentGroupMap('', 'asc', 1, this.pageSize);

        if(x["result"].valueOf() == true)
        {
          this.toastr.success("Service ID - Assignment Group row created successfully!", "Service ID - Assignment Group Map");
        }
        else
        {
          this.toastr.error("Service ID - Assignment Group row creation error ...", "Service ID - Assignment Group Map");
        }
      });

      this.paginator.firstPage();
      this.dialogRef.close(this.form.value);
  }

    close(){
      this.dialogRef.close();
    }

}
