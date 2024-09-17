import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { Geolocation } from '@capacitor/geolocation';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

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
  selectedBasemap: string = 'satellite'; // Default basemap ID
  private userLocationGraphic: Graphic | undefined;

  // URL Layanan Cuaca NOAA
  private readonly WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';

  constructor() {}

  public async ngOnInit() {
    // Set default location (London)
    this.longitude = -95.6892; // Longitude for Topeka, Kansas
    this.latitude = 39.0458;  // Latitude for Topeka, Kansas

    // Initialize the map with the default basemap
    const map = new Map({
      basemap: this.selectedBasemap as any  // Use basemap ID directly
    });

    this.view = new MapView({
      container: 'container',  // Ensure this ID is in the template
      map: map,
      center: [this.longitude, this.latitude], // Default center (London)
      zoom: 12
    });

    // Attempt to add the weather service layer
    try {
      const weatherServiceFL = new ImageryLayer({
        url: this.WeatherServiceUrl,
        opacity: 0.7,  // Transparency
        visible: true  // Ensure layer is visible
      });

      map.add(weatherServiceFL);
    } catch (error) {
      console.error("Failed to add weather service layer:", error);
      // Optionally, add a different layer to test
      // const fallbackLayer = new ImageryLayer({
      //   url: 'https://your-fallback-url.com/ImageryServer',
      //   opacity: 0.7,
      //   visible: true
      // });
      // map.add(fallbackLayer);
    }

    // Add default marker at the initial location (London)
    this.addMarker(this.longitude, this.latitude);
  }

  //   // Update user location periodically
  //   setInterval(() => this.updateToCurrentPosition(), 10000);
  // }

  // Function to hide the card
  closeCard() {
    this.showCard = false;
  }

  // Function to add a marker to the map at the specified coordinates
  private addMarker(longitude: number, latitude: number) {
    if (this.view) {
      const point = new Point({
        longitude: longitude,
        latitude: latitude
      });

      const markerSymbol = new SimpleMarkerSymbol({
        color: [226, 119, 40],  // Orange color
        outline: {
          color: [255, 255, 255],  // White outline
          width: 2
        },
        size: 10
      });

      const markerGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      });

      this.view.graphics.add(markerGraphic);
    }
  }

  // Function to update the map center to the current position and add a marker
  async updateToCurrentPosition() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    if (this.view) {
      // Update the map view to the current position
      this.view.center = new Point({
        longitude: this.longitude,
        latitude: this.latitude
      });

      // Remove previous markers
      this.view.graphics.removeAll();

      // Add a new marker at the current location
      this.addMarker(this.longitude, this.latitude);
    }
  }

  // Function to change the basemap
  changeBasemap() {
    if (this.view) {
      const newBasemap = Basemap.fromId(this.selectedBasemap);
      this.view.map.basemap = newBasemap;
    }
  }
}
