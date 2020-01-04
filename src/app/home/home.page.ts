import { Component } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import {finalize} from 'rxjs/operators';
import { from } from 'rxjs';
import * as xml2js from 'xml2js';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public xmlItems : any;

data=[];
url2='https://swapi.co/api/films/'
url='http://bayi.oznetonline.com/faturaServis/?kullanici_adi=ahsapi&sifre=112233&islem=faturaSorgula&kurum=1003&tesisat_no=5556537962';
  constructor(private http:HttpClient,private nativeHttp:HTTP,
    private plt:Platform,private loadCtrl:LoadingController) {}
  async getDataStandart(){
   let loading= await this.loadCtrl.create();
   await loading.present();
 
   let nativeCall=this.nativeHttp.get(this.url2,{},{
     'Content-Type':'application/json'
   });
      from(nativeCall).pipe(
   finalize(()=>loading.dismiss())
 ).subscribe(data=>{
   console.log('neative data',data);
   this.data= data['results'];
 },err=>{console.log('js call error',err)})
 
 
  }
  
  
async  getDataNativeHttp(){

  let loading= await this.loadCtrl.create();
  await loading.present();

  let nativeCall=this.nativeHttp.get(this.url+'/api',{},{
    'Content-Type':'application/json'
  });
     from(nativeCall).pipe(
  finalize(()=>loading.dismiss())
).subscribe(data=>{
  console.log('neative data',data);
  this.data= data['results'];
},err=>{console.log('js call error',err)})

  }
 async getDataEveryWere(){
  let loading= await this.loadCtrl.create();
  await loading.present();
   let nativeCall=this.nativeHttp.get(this.url+'/api',{},
      {'Content-Type':'text/xml'
      });
      from(nativeCall).pipe(finalize(()=>loading.dismiss())).subscribe((data)=>
      {
         this.parseXML(data)
         .then((data)=>
         {
            this.xmlItems = data;
         });
      });
   }


   parseXML(data)
   {
      return new Promise(resolve =>
      {
         var k,
             arr    = [],
             parser = new xml2js.Parser(
             {
                trim: true,
                explicitArray: true
             });

         parser.parseString(data, function (err, result)
         {
            var obj = result.comics;
            for(k in obj.fatura)
            {
               var item = obj.fatura[k];
               arr.push({
                  sorguno      : item.sorguNo[0],
                  tesisatno      : item.tesisatNo[0],
                  faturaSahibi : item.faturaSahibi[0],
                  faturano       : item.faturaNo[0]
               });
            }

            resolve(arr);
         });
      });
   }

  }

