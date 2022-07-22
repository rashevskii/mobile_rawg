import React from 'react';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';

const NameGame = styled.Text`
  font-size: 24px;
  color: #fff;
`;
const Rating = styled.Text`
  font-size: 20px;
  color: #fff;
`;
const Release = styled.Text`
  font-size: 20px;
  color: #fff;
`;
const Platforms = styled.Text`
  font-size: 20px;
  color: #fff;
`;

const CardWrapper = styled.View`
  background-color: #202020;
  border-radius: 15px;
  margin-bottom: 35px;
`;

const InfoWrapper = styled.View`
  padding: 20px 10px;
  color: #fff;
`;
const GameImage = styled.Image`
  width: 100%;
  height: 200;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

export const GameCard = ({game, navigation}) => {
  const handlePress = () => {
    navigation.navigate('Details', {
      id: game.id,
    });
  };
  const platforms = game.platforms
    .map(platform => platform.platform.name)
    .join(', ');
  return (
    <CardWrapper>
      <Pressable onPress={handlePress}>
        <GameImage source={{uri: game.background_image}} />
        <InfoWrapper>
          <NameGame>{game.name}</NameGame>
          <Rating>Рейтинг: {game.rating}</Rating>
          <Release>Дата релиза: {game.released}</Release>
          <Platforms>Платформы: {platforms}</Platforms>
        </InfoWrapper>
      </Pressable>
    </CardWrapper>
  );
};
