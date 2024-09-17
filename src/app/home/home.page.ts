import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  showCard = true;
  private latitude: number | any;
  private longitude: number | any;
  private view: MapView | undefined;

  constructor() {}

  public async ngOnInit() {
    // Set default location (London)
    this.longitude = -0.1278;
    this.latitude = 51.5074;

    // Initialize the map with default location
    const map = new Map({
      basemap: 'topo-vector'
    });

    this.view = new MapView({
      container: 'container',
      map: map,
      center: [this.longitude, this.latitude], // Default center
      zoom: 12
    });
  }

  // Function to hide the card
  closeCard() {
    this.showCard = false;
  }

  // Function to update the map center to the current position and add a marker
  async updateToCurrentPosition() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    if (this.view) {
      // Create a point for the current location
      const point = new Point({
        longitude: this.longitude,
        latitude: this.latitude
      });

      // Update the view center to the current position
      this.view.center = point;

      // Create a simple marker symbol
      const markerSymbol = new SimpleMarkerSymbol({
        color: [226, 119, 40],  // Orange color
        outline: {
          color: [255, 255, 255],  // White outline
          width: 2
        },
        size: 10
      });

      // Create a graphic representing the marker
      const markerGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      });

      // Clear any existing graphics and add the marker to the view
      this.view.graphics.removeAll();
      this.view.graphics.add(markerGraphic);
    }
  }
}
