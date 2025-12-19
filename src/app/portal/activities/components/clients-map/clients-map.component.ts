import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { ClientPin } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-clients-map',
  template: `
    <div
      leaflet
      [leafletOptions]="options"
      [leafletLayers]="layers"
      (leafletMapReady)="onMapReady($event)"
      class="map-container"></div>
  `,
  styles: [
    `
      .map-container {
        height: 420px;
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
      }
    `,
  ],
})
export class ClientsMapComponent implements OnChanges {
  @Input() pins: ClientPin[] = [];

  options: L.MapOptions = {
    zoom: 10,
    center: L.latLng(43.6532, -79.3832), // Toronto default
    scrollWheelZoom: false,
  };

  private map?: L.Map;
  private cluster = L.markerClusterGroup();

  layers: L.Layer[] = [
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }),
    this.cluster,
  ];

  /* ---------------- Lifecycle ---------------- */

  onMapReady(map: L.Map) {
    this.map = map;

    // If pins already arrived before map init
    if (this.pins.length) {
      this.renderPins();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pins'] && this.map) {
      this.renderPins();
    }
  }

  /* ---------------- Public API ---------------- */

  recenter() {
    if (!this.map) return;

    const layers = (this.cluster as any).getLayers?.() ?? [];
    if (!layers.length) return;

    const bounds = L.featureGroup(layers).getBounds();

    if (bounds.isValid()) {
      this.map.flyToBounds(bounds.pad(0.15), {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }

  /* ---------------- Internal ---------------- */

  private renderPins() {
    this.cluster.clearLayers();

    const bounds = L.latLngBounds([]);

    for (const pin of this.pins) {
      if (typeof pin.lat !== 'number' || typeof pin.lng !== 'number') continue;

      const marker = L.marker([pin.lat, pin.lng]).bindPopup(
        `
        <b>${this.escape(pin.name)}</b><br/>
        ${this.escape(pin.address)}
        `
      );

      this.cluster.addLayer(marker);
      bounds.extend([pin.lat, pin.lng]);
    }

    if (this.map && bounds.isValid()) {
      this.map.fitBounds(bounds.pad(0.15));
    }
  }

  private escape(value: string) {
    return (value || '').replace(
      /[&<>"']/g,
      c =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }[c] as string)
    );
  }
}
