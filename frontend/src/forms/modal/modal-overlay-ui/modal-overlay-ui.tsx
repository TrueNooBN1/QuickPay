import './modal-overlay-ui.css';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div className="overlay" onClick={onClick} data-cy='modal-overlay' />
);
