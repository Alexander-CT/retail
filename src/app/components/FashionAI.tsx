import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';
import { useEffect, useRef, useState } from 'react';
import WebcamCapture from './WebcamCapture';

const FashionAI = () => {
    const [image, setImage] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (image) {
            const loadAndPredict = async () => {
                const net = await bodyPix.load();
                const img = new Image();
                img.src = image;
                img.onload = async () => {
                    const segmentation = await net.segmentPerson(img);
                    const ctx = canvasRef.current?.getContext('2d');
                    ctx?.drawImage(img, 0, 0);

                    // Aquí añadirías el código para superponer la ropa
                    // Por simplicidad, este ejemplo solo dibuja la segmentación
                    const mask = bodyPix.toMask(segmentation);
                    ctx?.putImageData(mask, 0, 0);
                };
            };
            loadAndPredict();
        }
    }, [image]);

    return (
        <>
            <WebcamCapture onCapture={setImage} />
            <canvas ref={canvasRef} width={640} height={480} />
        </>
    );
};

export default FashionAI;
