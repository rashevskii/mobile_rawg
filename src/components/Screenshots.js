import React, {useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchScreenshots} from '../redux/detailGameSlice';
import Swiper from 'react-native-swiper';

export const Screenshots = ({id}) => {
  const dispatch = useDispatch();
  const screenshots = useSelector(state => state.details.screenshots);
  const screenshotsStatus = useSelector(
    state => state.details.statusScreenshots,
  );
  const screenshotsError = useSelector(state => state.details.errorScreenshots);

  useEffect(() => {
    dispatch(fetchScreenshots(id));
  }, [dispatch, id]);
  let content;

  if (screenshotsStatus === 'loading') {
    content = <Text>Loading...</Text>;
  } else if (screenshotsStatus === 'succeeded') {
    content = (
      <View>
        <Swiper style={styles.wrapper} autoplay>
          {screenshots.map(screen => (
            <Image
              key={screen.id}
              style={styles.image}
              source={{uri: screen.image}}
            />
          ))}
        </Swiper>
      </View>
    );
  } else if (screenshotsStatus === 'failed') {
    content = <Text>{screenshotsError}</Text>;
  }

  return <SafeAreaView>{content}</SafeAreaView>;
};

const styles = StyleSheet.create({
  wrapper: {
    height: 250,
  },
  image: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
  },
});
