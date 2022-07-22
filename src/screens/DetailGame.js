import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {Screenshots} from '../components/Screenshots';
import {fetchDetailsGame} from '../redux/detailGameSlice';

const MainWrapper = styled.View`
  background-color: #151515;
  flex: 1;
`;
const InfoWrapper = styled.View`
  padding: 0 10px;
`;
const GameImage = styled.Image`
  width: 100%;
  height: 200;
`;
const NameGame = styled.Text`
  font-size: 24px;
  color: #fff;
  padding: 10px 0;
`;
const Description = styled.Text`
  font-size: 18px;
  color: #fff;
  padding: 10px 0;
`;
const Link = styled.TouchableOpacity`
  background-color: #202020;
  align-items: center;
  justify-content: center;
  height: 40px;
`;
const TextInLink = styled.Text`
  color: #fff;
  text-transform: uppercase;
`;
const IndicatorWrapper = styled.View`
  height: 50%;
  align-items: center;
  justify-content: center;
`;

export const DetailGame = ({route}) => {
  const {id} = route.params;
  const dispath = useDispatch();
  const details = useSelector(state => state.details.details);
  const detailsStatus = useSelector(state => state.details.statusDetails);
  const detailsError = useSelector(state => state.details.errorDetails);
  const url = details?.website;

  useEffect(() => {
    dispath(fetchDetailsGame(id));
  }, [dispath, id]);

  const handleOpenLink = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    supported
      ? await Linking.openURL(url)
      : Alert.alert(`Мы не знаем как открыть этот URL: ${url}`);
  }, [url]);

  let content;

  if (detailsStatus === 'loading') {
    content = (
      <IndicatorWrapper>
        <ActivityIndicator size="large" />
      </IndicatorWrapper>
    );
  } else if (detailsStatus === 'succeeded') {
    content = (
      <ScrollView>
        <GameImage source={{uri: details.background_image}} />
        <InfoWrapper>
          <NameGame>
            {details.name === 'UNDEFINED'
              ? 'Название не установлено'
              : details.name}
          </NameGame>
          <Link onPress={handleOpenLink}>
            <TextInLink>Ссылка на игру</TextInLink>
          </Link>
          <Description>{details.description}</Description>
        </InfoWrapper>
        <Screenshots id={id} />
      </ScrollView>
    );
  } else if (detailsStatus === 'failed') {
    content = <Text>{detailsError}</Text>;
  }

  return <MainWrapper>{content}</MainWrapper>;
};
