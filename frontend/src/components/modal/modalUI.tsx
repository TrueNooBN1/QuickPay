import { type FC, memo, type ReactNode } from 'react';

import styles from './modal.module.css';


export type TModalUIProps = {
  title: string;
  onClose: () => void;
  children?: ReactNode;
};

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div className={styles.overlay} onClick={onClick} data-cy='modal-overlay' />
);


export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => (
    <>
      <div className={styles.modal} data-cy='modal'>
        <div className={styles.header}>
          <h3 className={`${styles.title}`}>
            {title}
          </h3>
          <button
            className={styles.button}
            type='button'
            data-cy={'close-modal'}
          >
            {/* <CloseIcon type='primary' onClick={onClose} /> */}
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <ModalOverlayUI onClick={onClose} />
    </>
  )
);
