import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProjectManagementService } from '../../../../projects.service';
import { ResultModel } from 'src/app/models/result.model';
import { ProjectModel } from '../../../../models/project.model';
import { ModalComponent } from 'src/app/_metronic/partials/layout/modals/modal/modal.component';
import { ModalConfig } from 'src/app/_metronic/partials';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_metronic/partials/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { PvCalcMonthlyModel } from '../../../../models/PvCalcMonthly.model';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexGrid,
    ApexTitleSubtitle
  } from "ng-apexcharts";
import { PvCalcMonthlyParamModel } from '../../../../models/PvCalcMonthlyParam.model';
import { SeriesCalcDailyParamModel } from '../../../../models/SeriesCalcDailyParam.model';

  export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
  };
  export type ChartOptionsLine = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    stroke: ApexStroke;
  };

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  //styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  selectedTab: number = 1;

  @ViewChild('modal') private modalComponent: ModalComponent;
  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chartLine") chartLine: ChartComponent;
  public chartOptions: ChartOptions 
  @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('monthSelect') monthSelect!: ElementRef;
  
  public chartOptionsLine: ChartOptionsLine;

  modalConfig: ModalConfig;
  form: FormGroup;

  lon: any
  lat: any
  systemPower: any 

  monthsInTurkish = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  monthsInEnglish = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  monthsLank: string[] = []

  lang: string;
  

  months = [
    { id: 0, name_tr: 'Ay Seçiniz', name_en: 'Select Month' },
    { id: 1, name_tr: 'Ocak', name_en: 'January' },
    { id: 2, name_tr: 'Şubat', name_en: 'February' },
    { id: 3, name_tr: 'Mart', name_en: 'March' },
    { id: 4, name_tr: 'Nisan', name_en: 'April' },
    { id: 5, name_tr: 'Mayıs', name_en: 'May' },
    { id: 6, name_tr: 'Haziran', name_en: 'June' },
    { id: 7, name_tr: 'Temmuz', name_en: 'July' },
    { id: 8, name_tr: 'Ağustos', name_en: 'August' },
    { id: 9, name_tr: 'Eylül', name_en: 'September' },
    { id: 10, name_tr: 'Ekim', name_en: 'October' },
    { id: 11, name_tr: 'Kasım', name_en: 'November' },
    { id: 12, name_tr: 'Aralık', name_en: 'December' }
  ];

  selectedMonthId: number | null = null;
  isTab1DataFetched: boolean = false;
  isTab2DataFetched: boolean = false;

  constructor(
      private fb: FormBuilder, 
      private projectManagementService: ProjectManagementService, 
      private alertService: AlertService,
      private translate: TranslateService
  ) {    }
    
   

  disableSubmitButton(): boolean {
      return this.form.valid;
  }

  get f() {
      return this.form.controls;
  }

  initForm() {
      this.form = this.fb.group({
          id: 0,
          manufacturer: [
              "",
              Validators.compose([
                  Validators.required,
              ]),
          ],
          model: [
              "",
              Validators.compose([
                  Validators.required,
              ]),
          ],
          series: [
              "",
              Validators.compose([
                  Validators.required,
              ]),
          ],
          type: [
              "",
              Validators.compose([
                  Validators.required,
              ]),
          ],
          maximumDCPower: [
              undefined,
              Validators.compose([
                  Validators.required,
              ]),
          ],
          isDeleted: false,
      });
  }

  ngOnInit(): void {
      this.initForm();

  }

  initializeChartLine(data?:any) {
    const hour =  data.map((item:any) => item.hour+":00");
    const pVSystemPowerW =  data.map((item:any) => item.pvSystemPowerW);
    const Consumption =  data.map((item:any) => item.consumption);
    const SystemCapacity =  data.map((item:any) => item.systemCapacity);
    const ClippedEnergy =  data.map((item:any) => item.clippedEnergy);

    this.chartOptionsLine = {
      series: [
        {
          name: "Production kWh",
          data: pVSystemPowerW
        },{
          name: "Consumption",
          data: Consumption
        },{
          name: "System Capacity",
          data: SystemCapacity
        },{
          name: "Clipped Energy",
          data: ClippedEnergy
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      xaxis: {
        categories: hour
      },
    };
  }

  initializeChart(data:any) {
    this.translate.get('LANG').subscribe((translation: string) => {
      if(translation==="tr"){
        this.monthsLank = this.monthsInTurkish;
      }else{
        this.monthsLank = this.monthsInEnglish;
      }
    });
    const productionkWhValues =  data.map((item:any) => item.productionkWh);
    const clippedEnergy =  data.map((item:any) => item.clippedEnergy);
    const consumption =  data.map((item:any) => item.consumption);
    const selfConsumption =  data.map((item:any) => item.selfConsumption);
    //const monthNoValues =  data.map((item:any) => item.monthNo);

    this.chartOptions = {
      series: [
        {
          name: "Production kWh",
          data: productionkWhValues
        },
        {
          name: "Clipped Energy",
          data: clippedEnergy
        },
        {
          name: "Consumption",
          data: consumption
        },
        {
          name: "Self Consumption",
          data: selfConsumption
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          //endingShape: 'rounded'
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: this.monthsLank
      },
      yaxis: {
        title: {
          text: "kWh"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " kWh";
          }
        }
      },
      legend: {
        show: true,
        position: 'top',  // Options: 'top', 'right', 'bottom', 'left'
        horizontalAlign: 'center', // Options: 'left', 'center', 'right'
        floating: false,
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 400,
        labels: {
          colors: '#333',
        },
        markers: {
          width: 10,
          height: 10,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      }
    };
  }

  openModal(data:any, systemPower:any) {

    this.translate.get('LANG').subscribe((translation: string) => {
      this.lang=translation

      if(translation=="tr"){
        this.modalConfig = {
          modalTitle: "Verimlilik Analizi",
          closeButtonLabel: "Kapat",
          submitCancellView: false

        };
      }else{
        this.modalConfig = {
          modalTitle: "Yield Analysis",
          closeButtonLabel: "Close",
          submitCancellView: false,


        };
      }
            
    });

    this.isTab1DataFetched = false;
    this.isTab2DataFetched = false;
    this.selectedTab = 1;
    console.log("--------")
    this.selectedMonthId=0;
    this.monthSelect.nativeElement.value = '0';

    const [lon, lat] = data.location.split(',').map((coord:any) => coord.trim());
        
    this.lon = lon
    this.lat = lat
    this.systemPower = systemPower

    this.fetchPvCalcData();

    this.modalComponent.open();
  }

  fetchPvCalcData() {
    const params: PvCalcMonthlyParamModel = {
      lat: parseFloat(this.lat),
      lon: parseFloat(this.lon),
      peakpower: parseFloat(this.systemPower),
      loss: 14,
      outputformat: 'json',
      usehorizon: 1
    };

    this.isTab1DataFetched = false;
    
    this.projectManagementService.getPvCalc(params)
      .subscribe(result => {
        if (result.isSuccess) {
          this.initializeChart(result.data);
          console.log(result);
          this.isTab1DataFetched = true;
        } else {
          console.log("Error: pvccalcMout");
        }
      });

}

  selectTab(tabIndex: number): void {
    this.selectedTab = tabIndex;
  }

  onMonthChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMonthId = Number(selectElement.value);
    console.log('Seçilen Ay ID:', this.selectedMonthId);

    const params: SeriesCalcDailyParamModel = {
      lat: parseFloat(this.lat),
      lon: parseFloat(this.lon),
      startyear: 2020,
      endyear: 2020,
      pvcalculation: 1,
      peakpower: 115,
      loss: 14,
      outputformat: 'json',
      usehorizon: 1,
      mountNumber: this.selectedMonthId
    };

    this.isTab2DataFetched = false;

    this.projectManagementService.getSeriescalc(params)
      .subscribe(result => {
        if (result.isSuccess) {
          this.initializeChartLine(result.data);
          console.log(result);
          this.isTab2DataFetched = true;
        } else {
          console.log("Error: pvccalcMout");
        }
      });
  }

}