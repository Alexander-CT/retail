import {
    useEffect,
    useRef,
    type DialogHTMLAttributes,
    type FunctionComponent,
    type MouseEvent,
    type MouseEventHandler,
    type ReactNode,
} from 'react';
type ModalProps = {
    isOpened: boolean;
    // onProceed: () => void;
    onClose: () => void;
    children: ReactNode;
    // className?: string;
} & DialogHTMLAttributes<HTMLDialogElement>;

const Modal: FunctionComponent<ModalProps> = ({
    isOpened = false,
    // onProceed,
    onClose,
    className,
    children,
}) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const isClickInsideRectangle = (
        event: MouseEvent<HTMLDialogElement>,
        element: HTMLDialogElement
    ) => {
        const rect = element?.getBoundingClientRect();
        if (rect)
            return (
                event.clientX > rect.left &&
                event.clientX < rect.right &&
                event.clientY > rect.top &&
                event.clientY < rect.bottom
            );
    };

    const handleClickDialog: MouseEventHandler<HTMLDialogElement> = (event) => {
        modalRef.current &&
            !isClickInsideRectangle(event, modalRef.current) &&
            onClose();
        // isClickInsideRectangle(event, modalRef.current);
    };

    // modalRef.current?.showModal();
    // const [email, setEmail] = useState('');
    useEffect(() => {
        if (isOpened) {
            modalRef.current?.showModal();
            document.body.classList.add('modal-open'); // prevent bg scroll
        } else {
            modalRef.current?.close();
            document.body.classList.remove('modal-open');
        }
    }, [isOpened]);

    // const handleCloseModal: MouseEventHandler<HTMLButtonElement> = (event) => {
    //     // event.preventDefault();
    //     modalRef.current?.close();
    // };

    // let disappearClass = !isOpened ? styles.disappear : '';
    // function timeout(callback: () => void, delay: number) {
    //     return new Promise((callback) => setTimeout(callback, delay));
    // }

    return (
        isOpened && (
            <dialog
                className={
                    className ||
                    'fixed inset-0 z-10 overflow-y-auto ::backdrop-filter backdrop-blur-sm'
                }
                data-modal
                ref={modalRef}
                onCancel={onClose}
                // open={isOpened}
                onClick={handleClickDialog}
            >
                {children}
            </dialog>
        )
    );
};

export default Modal;
