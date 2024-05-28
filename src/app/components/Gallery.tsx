'use client';
import Button from '@/app/components/Button';
import Modal from '@/app/components/Modal';
import {
    load as cocoLoad,
    type DetectedObject,
    type ObjectDetection,
} from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
    useEffect,
    useRef,
    useState,
    type FunctionComponent,
    type HTMLAttributes,
    type RefObject,
} from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

let interval = null as unknown as NodeJS.Timeout;
let stopTimeout: NodeJS.Timeout = null as unknown as NodeJS.Timeout;
type GalleryProps = {
    data: ApiResult;
} & HTMLAttributes<HTMLDivElement>;

const FashionAI = dynamic(() => import('./FashionAI'), { ssr: false });

const Gallery: FunctionComponent<GalleryProps> = ({ data, ...rest }) => {
    // const modalRef = useRef<HTMLDialogElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [dialog, setDialog] = useState(false);
    // const webcamRef = useRef<HTMLVideoElement>(null);

    const [mirrored, setMirrored] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [autoRecordEnabled, setAutoRecordEnabled] = useState(false);
    const [model, setModel] = useState<ObjectDetection>();
    const [isLoading, setIsLoading] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const formatDate = (date: Date) => {
        const formattedDate = [
            [
                (date.getMonth() + 1).toString().padStart(2, '0'),
                date.getDate().toString().padStart(2, '0'),
                date.getFullYear(),
            ].join('-'),
            [
                date.getHours().toString().padStart(2, '0'),
                date.getMinutes().toString().padStart(2, '0'),
                date.getSeconds().toString().padStart(2, '0'),
            ].join('-'),
        ].join(' ');
        return formattedDate;
    };

    const base64toBlob = (base64Data: string | null) => {
        if (!base64Data) return;
        const byteCharacters = atob(base64Data?.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteCharacters.length);
        const byteArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: 'image/png' }); // Specify the image type here
    };

    const userPromptScreenshot = () => {
        // take picture
        if (!webcamRef.current) {
            toast('Camera not found. Please refresh');
        } else {
            const imgSrc = webcamRef.current.getScreenshot();
            console.log(imgSrc);
            const blob = base64toBlob(imgSrc);
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${formatDate(new Date())}.png`;
            a.click();
        }
        // save it to downloads
    };

    const startRecording = (doBeep: boolean) => {
        if (
            webcamRef.current &&
            mediaRecorderRef.current?.state !== 'recording'
        ) {
            mediaRecorderRef.current?.start();
            // doBeep && beep(volume);

            stopTimeout = setTimeout(() => {
                if (mediaRecorderRef.current?.state === 'recording') {
                    mediaRecorderRef.current.requestData();
                    mediaRecorderRef.current.stop();
                }
            }, 30000);
        }
    };

    useEffect(() => {
        if (webcamRef.current?.video) {
            const stream = (
                webcamRef.current.video as HTMLVideoElement & {
                    captureStream?: () => MediaStream;
                }
            ).captureStream!();
            // const stream = (
            //     webcamRef.current.video as HTMLVideoElement
            // ).captureStream();
            if (stream && mediaRecorderRef.current) {
                mediaRecorderRef.current = new MediaRecorder(stream);

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        const recordedBlob = new Blob([event.data], {
                            type: 'video',
                        });
                        const videoUrl = URL.createObjectURL(recordedBlob);
                        const a = document.createElement('a');
                        a.href = videoUrl;
                        a.download = `${formatDate(new Date())}.webm`;
                        a.click();
                    }
                    // if (event.data && canvasRef.current) {
                    //     canvasRef.current
                    //         .getContext('2d')
                    //         ?.drawImage(event.data, 0, 0);
                    // }
                };
            }
        }
        setMirrored(true);
    }, []);

    const userPromptRecord = () => {
        if (!webcamRef.current) {
            toast('Camera is not found. Please refresh.');
        }

        if (mediaRecorderRef.current?.state === 'recording') {
            // check if recording
            // then stop recording
            // and save to downloads
            mediaRecorderRef.current.requestData();
            clearTimeout(stopTimeout);
            mediaRecorderRef.current.stop();
            toast('Recording saved to downloads');
        } else {
            // if not recording
            // start recording
            startRecording(false);
        }
    };

    const initModel = async () => {
        const loadedModel: ObjectDetection = await cocoLoad({
            base: 'mobilenet_v2',
        });

        setModel(loadedModel);
    };
    type DrawOnCanvasProps = {
        mirrored: boolean;
        predictions: Array<DetectedObject>;
        ctx?: CanvasRenderingContext2D | null;
    };
    const drawOnCanvas: (props: DrawOnCanvasProps) => Promise<void> = async ({
        mirrored,
        predictions,
        ctx,
    }) => {
        predictions.forEach((detectedObject: DetectedObject) => {
            const { class: name, bbox, score } = detectedObject;
            const [x, y, width, height] = bbox;

            if (ctx) {
                ctx.beginPath();

                // styling
                ctx.fillStyle = name === 'person' ? '#FF0F0F' : '#00B612';
                ctx.globalAlpha = 0.4;

                mirrored
                    ? ctx.roundRect(ctx.canvas.width - x, y, -width, height, 8)
                    : ctx.roundRect(x, y, width, height, 8);

                // draw stroke or fill
                ctx.fill();

                // text styling
                ctx.font = '12px Courier New';
                ctx.fillStyle = 'black';
                ctx.globalAlpha = 1;
                mirrored
                    ? ctx.fillText(
                          name,
                          ctx.canvas.width - x - width + 10,
                          y + 20
                      )
                    : ctx.fillText(name, x + 10, y + 20);
            }
        });
    };
    const resizeCanvas = (
        canvasRef: RefObject<HTMLCanvasElement>,
        webcamRef: RefObject<Webcam>
    ) => {
        const canvas = canvasRef.current;
        const video = webcamRef.current?.video;

        if (canvas && video) {
            const { videoWidth, videoHeight } = video;
            canvas.width = videoWidth;
            canvas.height = videoHeight;
        }
    };

    const runPrediction = async () => {
        if (
            model &&
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState === 4
        ) {
            const predictions: Array<DetectedObject> = await model.detect(
                webcamRef.current.video
            );

            resizeCanvas(canvasRef, webcamRef);
            drawOnCanvas({
                mirrored,
                predictions,
                ctx: canvasRef.current?.getContext('2d'),
            });

            let isPerson = false;
            if (predictions.length > 0) {
                predictions.forEach((prediction) => {
                    isPerson = prediction.class === 'person';
                });

                if (isPerson && autoRecordEnabled) {
                    startRecording(true);
                }
            }
        }
    };

    useEffect(() => {
        setIsLoading(true);
        initModel();
    }, []);
    useEffect(() => {
        if (model) {
            setIsLoading(false);
        }
    }, [model]);
    useEffect(() => {
        interval = setInterval(() => {
            runPrediction();
        }, 100);

        return () => clearInterval(interval);
    }, [webcamRef.current, model, mirrored, autoRecordEnabled, runPrediction]);

    return (
        <>
            <div {...rest}>
                {data?.results.map((image) => (
                    <div key={image.id} className='flex flex-col'>
                        <Image
                            className='aspect-[3/4] w-full object-cover hover:opacity-75 hover:duration-200'
                            src={image.urls.regular || ''}
                            alt={image.description}
                            width={400}
                            height={400}
                            priority
                            // loader={<ImageLoaderProduct src={image.urls.regular} alt={image.description} />}
                        />
                        <Button
                            variant='primary'
                            size='md'
                            onClick={() => setDialog(true)}
                        >
                            Try on
                        </Button>
                    </div>
                ))}
            </div>
            <Modal
                isOpened={dialog}
                onClose={() => setDialog(false)}
                className='bg-gray-800 flex flex-col justify-center items-center rounded-3xl p-10 fixed'
            >
                <Button
                    className='absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2'
                    size='icon'
                    onClick={() => setDialog(false)}
                >
                    x
                </Button>
                <h1 className='flex text-3xl text-sky-200'>Webcam</h1>
                <Button
                    onClick={userPromptRecord}
                    className='text-sky-200 bg-slate-700 rounded-3xl hover:bg-slate-600 p-3 m-3'
                >
                    Active
                </Button>
                <Webcam
                    ref={webcamRef}
                    // mirrored={mirrored}
                    className='relative h-full w-full'
                />
                <canvas
                    ref={canvasRef}
                    // width={400}
                    className='flex absolute aspect-[16/9'
                />
                {/* <FashionAI /> */}
            </Modal>
        </>
    );
};

export default Gallery;
