import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import Button from '../../components/button/button';
import Text from '../../components/text/text';
import { mapApiKey, supportLink, supportLinkText } from '../../const/const';
import { YandexMapCustom, type YandexMapCustomProps } from '../../components/map/ymap';
import { VideoPlayer } from '../../components/videoplayer/videoplayer';
import "./abaout-page.css"

export const AboutPage: FC = () => {
  const navigate = useNavigate();

  const mapProps : YandexMapCustomProps = {
    center: [43.472548, 43.585395],
    zoom: 16,
    apikey: mapApiKey,
    markers: [{
      coordinates: [43.472548, 43.585395],
      hint: "QuickPay"}
    ]
  }
  
  return (
  <Page>
    <Text className='full-width'>
      Адрес: г.Нальчик, ул. Кулиева 2б
    </Text>
    
    <YandexMapCustom
      center = {mapProps.center}
      zoom = {mapProps.zoom}
      apikey = {mapProps.apikey}
      markers = {mapProps.markers}
      className = {"full-width"}/>
    <Text className='full-width'>
      Как добраться
    </Text>
    <VideoPlayer 
      src = {"/video/how-to-reach.mp4"}
      poster = {"/img/previewVertical.png"}
      className='full-width'
      posterClassName='poster'
      height={"400px"}
    />

    <Text className='fill-width'>
        Поддержка
    </Text>
    <Link
      to={supportLink}
      target='_blank'
      className='link'
    >
      {supportLinkText}
    </Link>
    <Button onClick={()=>{navigate("/")}}>
      На главную
    </Button>
    <div></div>
  </Page>
)};
