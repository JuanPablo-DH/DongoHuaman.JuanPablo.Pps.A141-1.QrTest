import { JsonPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from "@capacitor-mlkit/barcode-scanning";

// https://www.npmjs.com/package/@capacitor-mlkit/barcode-scanning
@Component({
  selector: "app-qr-test",
  standalone: true,
  imports: [JsonPipe],
  templateUrl: "./qr-test.component.html",
  styleUrls: ["./qr-test.component.scss"],
})
export class QrTestComponent implements OnInit {
  data: any = { estado: "esperando" };
  error: any = { estado: "esperando" };
  constructor() {
    this.instalarGoogleBarcodeScannerModule();
  }

  ngOnInit() {
    this.instalarGoogleBarcodeScannerModule();
  }

  // Es necesario instalar GoogleBarcodeScannerModule al momento de crear el componente
  private async instalarGoogleBarcodeScannerModule() {
    const isAvailable = await this.isGoogleBarcodeScannerModuleAvailable();
    if (!isAvailable) {
      await this.installGoogleBarcodeScannerModule();
    }
  }

  async startScan() {
    try {
      // The camera is visible behind the WebView, so that you can customize the UI in the WebView.
      // However, this means that you have to hide all elements that should not be visible.
      // You can find an example in our demo repository.
      // In this case we set a class `barcode-scanner-active`, which then contains certain CSS rules for our app.
      document.querySelector("body")?.classList.add("barcode-scanner-active");

      // Add the `barcodeScanned` listener
      const listener = await BarcodeScanner.addListener(
        "barcodeScanned",
        async (result) => {
          console.log(result.barcode);
          this.data = result.barcode;
        }
      );

      // Start the barcode scanner
      await BarcodeScanner.startScan();
    } catch (e) {
      this.error = e;
    }
  }

  async stopScan() {
    {
      // Make all elements in the WebView visible again
      document
        .querySelector("body")
        ?.classList.remove("barcode-scanner-active");

      // Remove all listeners
      await BarcodeScanner.removeAllListeners();

      // Stop the barcode scanner
      await BarcodeScanner.stopScan();
    }
  }

  async scanSingleBarcode() {
    return new Promise(async (resolve) => {
      document.querySelector("body")?.classList.add("barcode-scanner-active");

      const listener = await BarcodeScanner.addListener(
        "barcodeScanned",
        async (result) => {
          await listener.remove();
          document
            .querySelector("body")
            ?.classList.remove("barcode-scanner-active");
          await BarcodeScanner.stopScan();
          resolve(result.barcode);
        }
      );

      await BarcodeScanner.startScan();
    });
  }

  async scan() {
    try {
      /*
      // Usarlo sin indicar el formato, para poder usar el QR del dni
      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode],
      });
      */
      const { barcodes } = await BarcodeScanner.scan();
      this.data = barcodes;
      return barcodes;
    } catch (e: any) {
      this.error = e.message;
      return;
    }
  }

  async isSupported() {
    const { supported } = await BarcodeScanner.isSupported();
    return supported;
  }

  async enableTorch() {
    await BarcodeScanner.enableTorch();
  }

  async disableTorch() {
    await BarcodeScanner.disableTorch();
  }

  async toggleTorch() {
    await BarcodeScanner.toggleTorch();
  }

  async isTorchEnabled() {
    const { enabled } = await BarcodeScanner.isTorchEnabled();
    return enabled;
  }

  async asyncisTorchAvailable() {
    const { available } = await BarcodeScanner.isTorchAvailable();
    return available;
  }

  async setZoomRatio() {
    await BarcodeScanner.setZoomRatio({ zoomRatio: 0.5 });
  }

  async getZoomRatio() {
    const { zoomRatio } = await BarcodeScanner.getZoomRatio();
    return zoomRatio;
  }

  async getMinZoomRatio() {
    const { zoomRatio } = await BarcodeScanner.getMinZoomRatio();
    return zoomRatio;
  }

  async getMaxZoomRatio() {
    const { zoomRatio } = await BarcodeScanner.getMaxZoomRatio();
    return zoomRatio;
  }

  async openSettings() {
    await BarcodeScanner.openSettings();
  }

  async isGoogleBarcodeScannerModuleAvailable() {
    const { available } =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    return available;
  }

  async installGoogleBarcodeScannerModule() {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  async checkPermissions() {
    const { camera } = await BarcodeScanner.checkPermissions();
    return camera;
  }

  async requestPermissions() {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera;
  }
}
