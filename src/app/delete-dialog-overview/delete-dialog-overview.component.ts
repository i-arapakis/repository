import { Component, OnInit, Inject, forwardRef, HostBinding, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ServiceID_AssignmentGroup_MapService } from '../shared/serviceID_assignmentGroup_map.service';
import { ServiceID_AssignmentGroup_DataSource } from '../shared/ServiceID_AssignmentGroup_DataSource';
import { FormsModule, Validators } from '@angular/forms';
import { ServiceIDAssignmentGroupMap } from '../shared/serviceID_assignmentGroup_map';
import { ToastrService } from 'ngx-toastr';
import { ID } from '../shared/id';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-delete-dialog-overview',
  templateUrl: './delete-dialog-overview.component.html',
  styleUrls: ['./delete-dialog-overview.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeleteDialogOverviewComponent),
      multi: true
    }
  ]
})
export class DeleteDialogOverviewComponent implements OnInit {

  description: string;
  service: ServiceID_AssignmentGroup_MapService;
  dataSource: ServiceID_AssignmentGroup_DataSource;
  id: string;
  pageSize: number;
  form: FormGroup;
  paginator: MatPaginator;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DeleteDialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) data, private toastr: ToastrService) { 
      this.description = data.description;
      this.form = this.fb.group({
        description: [this.description, []]
      });

      this.id = data.id;
      this.pageSize = data.pageSize;
      this.service = data.service;
      this.dataSource = data.dataSource;
      this.paginator = data.paginator;
    }

  ngOnInit() {
  }

  delete(){
    let id : ID = { id : this.id };
    this.service.deleteServiceIDAssignmentGroupMapRow(id)
    .subscribe(x => {
      this.service.getServiceIDAssignmentGroupMapLength();
      this.dataSource.loadServiceIDAssignmentGroupMap('', 'asc', 1, this.pageSize);

      if(x["result"].valueOf() == true){
        this.toastr.success(x["info"], "Service ID - Assignment Group Map");
      }
      else{
        this.toastr.error(x["info"], "Service ID - Assignment Group Map");
      }
    })

    this.paginator.firstPage();
    this.dialogRef.close(this.form.value);
  }

  close(){
    this.dialogRef.close();
  }

}
