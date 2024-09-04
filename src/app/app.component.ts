import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexedDbService } from './services/indexedDb.service';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AddFormComponent } from './components/add-form/add-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AddFormComponent],
  providers:[IndexedDbService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ng_pwa';
  processResult = function (r:Event) {
    let resp:IDBRequest = r.target as IDBRequest;
    return of(resp.result);
  };
  constructor(private indexedDbService: IndexedDbService) {}

  ngOnInit() {
    this.getData();
  }
  addData() {
    this.indexedDbService.addData({ id: 2, name: 'Vishnu Sharma' }).subscribe(() => {
      console.log('Data added successfully');
      this.getData();
    });
  }
  getData() {
    this.indexedDbService.getData().pipe(mergeMap((x:any) => this.processResult(x))).subscribe((res:any) => {
      console.log(res);
    })
  }
  getDataById(id:number) {
    this.indexedDbService.getRecordById(id).pipe(mergeMap((x:any) => this.processResult(x))).subscribe((res:any) => {
      console.log(res);
    })
  }
  deleteDataById(id:number) {
    this.indexedDbService.deleteById(id).pipe(mergeMap((x:any) => this.processResult(x))).subscribe((res:any) => {
      console.log(res);
    })
  }
}
