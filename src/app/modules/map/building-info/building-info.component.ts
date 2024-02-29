import { Component } from '@angular/core';

@Component({
  selector: 'map-building-info',
  templateUrl: './building-info.component.html',
  styleUrls: ['./building-info.component.scss']
})
export class BuildingInfoComponent {
  
  buildingInfoVisibility : boolean = false;
  propertiesList : any[];

  showPanel(properties: any) {
    this.propertiesList = [];
    let propNames = Object.keys(properties);

    propNames.forEach(propName => {
      this.propertiesList.push({key: propName, value: properties[propName]});
    })
    this.buildingInfoVisibility = true;
  }

  closePanel() {
    this.buildingInfoVisibility = false;
  }
}