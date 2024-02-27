import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  constructor() {}

  generateQRCodeAsDataURL(text: string, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if(text)
        QRCode.toDataURL(text, { width: size }, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      else
        resolve("");
    });
  }
}
