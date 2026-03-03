import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import Button from '../../components/button/button';
import Text from '../../components/text/text';

export const AboutPage: FC = () => {
  const navigate = useNavigate();
  
  return (
  <Page>
    <h3>
      <Text >
        Какая-то информация о нас
      </Text>
    </h3>
    <Button onClick={()=>{navigate("/")}}>
      На главную
    </Button>
  </Page>
)};
