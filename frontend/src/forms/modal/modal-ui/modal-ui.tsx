import { type FC, memo, type ReactNode } from 'react';

import '../modal.css';
import { ModalOverlayUI } from "../modal-overlay-ui/modal-overlay-ui";
import SecondaryButton from '../../../components/button/secondary-button/secondary-button';

// import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
// import { TModalUIProps } from './type';
// import { ModalOverlayUI } from '@ui';

export type TModalUIProps = {
  title: string;
  onClose: () => void;
  children?: ReactNode;
};

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => (
    <>
      <div className="modal" data-cy='modal'> 
        <div className="modal-header">
          <h3 className={`modal-title`}>
            {title}
          </h3>
          <SecondaryButton onClick={onClose}>Закрыть</SecondaryButton>
        </div>
        <div className={"modal-content"}>{children}</div>
      </div>
      <ModalOverlayUI onClick={onClose} />
    </>
  )
);
