import type { FC } from 'react';
import { Page } from '../../pages/Page';
import { Oval } from 'react-loader-spinner';

const Preloader: FC = ()=>{ 
  return <Page>
      <Oval
        height={160}
        width={160}
        color="var(--secondary-color)"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#ffffff"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </Page>;
}

export default Preloader;