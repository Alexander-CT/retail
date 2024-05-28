import { useRef, type FunctionComponent } from 'react';
import Webcam from 'react-webcam';
type WebcamCaptureProps = {
    onCapture: (imageSrc: string) => void;
};

const WebcamCapture: FunctionComponent<WebcamCaptureProps> = ({
    onCapture,
}) => {
    const webcamRef = useRef<Webcam>(null);

    const capture = () => {
        const imageSrc = webcamRef.current?.getScreenshot() ?? '';
        onCapture(imageSrc);
        // capture();
    };

    return (
        <>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/webp'
                width='100%'
                videoConstraints={{ facingMode: 'user' }}
            />
            <button onClick={capture}>Capturar</button>
        </>
    );
};

export default WebcamCapture;
