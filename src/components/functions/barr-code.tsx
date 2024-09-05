import React, { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function BarcodeScanner() {
    const [scannedCode, setScannedCode] = useState<string | null>(null);

    const scanBarcode = async () => {
        try {
            // Tomar una foto usando la cámara
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri
            });

            if (photo && photo.webPath) {
                // Crear un objeto ZXing para escanear el código de barras desde la imagen
                const codeReader = new BrowserMultiFormatReader();
                const imgElement = document.createElement('img');
                imgElement.src = photo.webPath;

                // Escanear el código de barras
                imgElement.onload = async () => {
                    try {
                        const result = await codeReader.decodeFromImageElement(imgElement);
                        setScannedCode(result.getText());
                    } catch (err) {
                        console.error('No se pudo escanear el código de barras:', err);
                        setScannedCode('No se pudo escanear el código de barras');
                    }
                };
            }
        } catch (error) {
            console.error('Error al abrir la cámara', error);
        }
    };

    return (
        <div>
            <h1>Lector de código de barras</h1>
            <button onClick={scanBarcode}>Escanear código de barras</button>
            {scannedCode && <p>Código escaneado: {scannedCode}</p>}
        </div>
    );
};
