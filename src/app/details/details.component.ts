import { HttpClient } from '@angular/common/http';
import { Component, OnInit , EventEmitter, Input  , Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NgModule } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  firstName="";
  data: any;
  isShowDivIf = false; 
  formula : any
  isrange=false
rateInput: any;
  constructor(
    public http: HttpClient,
    public apiService: ApiService,
    public router: ActivatedRoute,
    private modalService: NgbModal,

  ) {  }
  ngOnInit(): void {
 this.add();

  }
  add() {
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
     size:"sm",
    // modalDialogClass: " modal-dialog-centered d-flex justify-content-center"
    });
    var id= this.router.snapshot.params['id'];
    console.log('id: ', id);
    // this.apiService.dcgById().subscribe((data: any) => {
      // this.data = data;
    this.apiService.dcgById(id).subscribe((data: any) => {
      loaderRef.close();
      var datan=data
      console.log('data: ', data);
      var result = Object.keys(data).map((key) => [String(key), data[key]]);
      this.data = datan;
    }, (error: any) => console.error(error));
  }
  amt(amtamount:any){
    this.data[0].min_amount
    console.log('  this.data[0].min_amount: ',   this.data[0].min_amount);
    this.data[0].max_amount 
    console.log('this.data[0].max_amount : ', this.data[0].max_amount );
    if( Number(amtamount) < Number(this.data[0].min_amount) ){
      this.isrange=true
      // alert("pass");
      // return false;
    }
    else if( Number(amtamount) > Number (this.data[0].max_amount) )
    {
      this.isrange=true
      // alert("pass"); 
    }
    else{
      
    this.isrange=false;
    const loaderRef = this.modalService.open(LoaderComponent,{
      centered: true,
      animation:true,
      backdrop:'static',
      keyboard: false,
      windowClass:"remove-bg-modal",
     size:"sm",
    // modalDialogClass: " modal-dialog-centered d-flex justify-content-center"
    });
    this.isShowDivIf=true
    var loan_amount=Number(amtamount);
    console.log('loan_amount: ', loan_amount);
    var id= this.router.snapshot.params['id'];
  
    this.apiService.dcgById(id).subscribe((data: any) => {
      var data=data
      console.log('data: ', data);
         loaderRef.close();
      var tenure=Number(data[0].tenure)
    var rate=data[0].roi 
    let result = rate.split('%')[0];
    var newrate=result/100;
    // newrate=Math.round(newrate*100)/100;
    var EMIAmount= Number((loan_amount*newrate/12)/(1-Math.pow((1+newrate/12),(-tenure))))
    EMIAmount=Math.round(EMIAmount*100)/100;
    console.log('EMIAmount: ',(Math.round), EMIAmount);
    var ADVANCE_EMI=  Number(EMIAmount * data[0].advance_emi)
    ADVANCE_EMI=Math.round(ADVANCE_EMI*100)/100;
    console.log('ADVANCE_EMI: ', ADVANCE_EMI);
    var PROCESSING_FEE =Number(data[0].processing_fee) 
    var  TotalPaymenttransaction=Number ( ADVANCE_EMI +PROCESSING_FEE)
    TotalPaymenttransaction=Math.round(TotalPaymenttransaction*100)/100;
    // console.log('data.PROCESSING_FEE: ', PROCESSING_FEE);
    var remaningemi=data[0].tenure - data[0].advance_emi
    console.log('TotalPaymenttransaction: ', TotalPaymenttransaction);
   var TotalIntrestduringloantenure =Number((EMIAmount * data[0].tenure) - loan_amount)
   TotalIntrestduringloantenure=Math.round(TotalIntrestduringloantenure*100)/100;
   console.log('TotalIntrestduringloantenure: ', TotalIntrestduringloantenure);
   var Totalofintrest = Number (TotalIntrestduringloantenure + PROCESSING_FEE)
   Totalofintrest=Math.round(Totalofintrest*100)/100;
   console.log('Totalofintrest: ', Totalofintrest);
   var Advance_EMI = ADVANCE_EMI
   console.log('Advance_EMI: ', Advance_EMI);
  var Amounttobepaidby =TotalPaymenttransaction
  console.log('Amounttobepaidby: ', Amounttobepaidby);
  var additional_Cashback=0;
  var net_Cost_Custmerr= Totalofintrest- TotalIntrestduringloantenure - additional_Cashback
  // net_Cost_Custmer=Math.round(net_Cost_Custmer*100)/100;
  var net_Cost_Custmer = net_Cost_Custmerr.toFixed(2)
  var dbd_result = data[0].dbd
  let dbdresult = dbd_result.split('%')[0];
  console.log('dbdresult: ', dbdresult);
  var dbdrate=Number(dbdresult/100);
  console.log('dbd_result: ', dbdrate);
  var dbd = dbdrate * amtamount
  var distributed_delerto_mmfsl= amtamount-(dbd + PROCESSING_FEE + Advance_EMI)
  this.formula={ EMIAmount:EMIAmount ,remaningemi:remaningemi
    ,ADVANCE_EMI:ADVANCE_EMI,
    Totalofintrest:Totalofintrest,
    Amounttobepaidby:Amounttobepaidby,
    TotalIntrestduringloantenure:TotalIntrestduringloantenure,
    net_Cost_Custmer:net_Cost_Custmer,
    dbd:dbd,
    distributed_delerto_mmfsl:distributed_delerto_mmfsl};
  console.log('formula: ', this.formula);
    }, (error: any) => console.error(error));
    
  }
  
  }
  range(){
  //  this.amtamount;

  }
}
