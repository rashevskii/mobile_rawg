import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {GameCard} from '../components/GameCard';
import {
  fetchFilteredGames,
  fetchGamesMore,
  fetchGamesPerPage,
  fetchPlatforms,
  fetchSearchGame,
  fetchSortedGames,
} from '../redux/gameSlice';
import {View, Text, FlatList, ActivityIndicator, Image} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import useDebounce from '../hooks/useDebounce';
import styled from 'styled-components/native';

const MainWrapper = styled.View`
  background-color: #151515;
  flex: 1;
`;
const FormWrapper = styled.View`
  background-color: #151515;
`;
const SortWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;
const Clear = styled.TouchableOpacity`
  width: 15%;
  align-items: center;
  justify-content: center;
`;
const FilterWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;
const SearchWrapper = styled.View`
  flex-direction: row;
`;
const SearchField = styled.TextInput`
  width: 85%;
  background-color: #151515;
  color: #fff;
  font-size: 18px;
  padding-left: 15px;
  padding-right: 15px;
`;
const ClearSearch = styled.TouchableOpacity`
  width: 15%;
  align-items: center;
  justify-content: center;
`;
const IndicatorWrapper = styled.View`
  height: 50%;
  align-items: center;
  justify-content: center;
`;
const FooterIndicatorWrapper = styled.View`
  height: 50px;
  align-items: center;
  justify-content: center;
`;

export const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const games = useSelector(state => state.games.games);
  const gamesStatus = useSelector(state => state.games.status);
  const moreStatus = useSelector(state => state.games.moreLoading);
  const errors = useSelector(state => state.games.error);
  const platforms = useSelector(state => state.games.platforms);
  const statusPlatforms = useSelector(state => state.games.statusPlatforms);
  const [page, setPage] = useState(2);
  const [text, setText] = useState('');
  const [order, setOrder] = useState('');
  const [filter, setFilter] = useState('');
  const [searched, setSearched] = useState(false);
  const dropdownRefSorts = useRef({});
  const dropdownRefPlatforms = useRef({});

  const debouncedSearchTerm = useDebounce(text, 700);

  const sorts = [
    'Рейтинг по возрастанию',
    'Рейтинг по убыванию',
    'Дата релиза по возрастанию',
    'Дата релиза по убыванию',
  ];

  useEffect(() => {
    gamesStatus === 'idle' ? dispatch(fetchGamesPerPage()) : null;
  }, [dispatch, gamesStatus]);

  useEffect(() => {
    statusPlatforms === 'idle' ? dispatch(fetchPlatforms()) : null;
  }, [dispatch, statusPlatforms]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(fetchSearchGame({debouncedSearchTerm, order, filter}));
      setSearched(true);
    }
  }, [dispatch, debouncedSearchTerm, order, filter]);

  const loadMore = () => {
    if (moreStatus !== 'loading') {
      setPage(page + 1);
      dispatch(fetchGamesMore({page, order, filter, text, searched}));
    }
  };
  let content;

  if (gamesStatus === 'loading') {
    content = (
      <IndicatorWrapper>
        <ActivityIndicator size="large" />
      </IndicatorWrapper>
    );
  } else if (gamesStatus === 'failed') {
    content = <Text>{errors}</Text>;
  }

  const renderItem = ({item}) => {
    return <GameCard navigation={navigation} game={item} />;
  };

  const renderFooter = () => {
    return (
      <FooterIndicatorWrapper>
        {moreStatus === 'loading' ? <ActivityIndicator /> : null}
      </FooterIndicatorWrapper>
    );
  };

  return (
    <MainWrapper>
      <FormWrapper>
        <SortWrapper>
          <SelectDropdown
            data={sorts}
            ref={dropdownRefSorts}
            defaultButtonText="Сортировать по"
            buttonStyle={{
              width: '85%',
              backgroundColor: '#151515',
              borderBottomColor: '#fff',
              borderBottomWidth: 1,
            }}
            buttonTextStyle={{color: '#fff'}}
            rowStyle={{backgroundColor: '#151515'}}
            rowTextStyle={{color: '#fff'}}
            onSelect={(selectedItem, index) => {
              setOrder(index);
              setPage(2);
              filter !== ''
                ? dispatch(fetchSortedGames({index, filter, text, searched}))
                : dispatch(fetchSortedGames({index, text, searched}));
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
          <Clear
            onPress={() => {
              if (order === '') {
                return;
              }
              dropdownRefSorts.current.reset();
              setOrder('');
              setPage(2);
              if (searched) {
                if (filter !== '') {
                  dispatch(fetchFilteredGames({filter, text, searched}));
                } else {
                  dispatch(fetchSearchGame(text));
                }
              } else {
                if (filter !== '') {
                  dispatch(fetchFilteredGames({filter, text, searched}));
                } else {
                  dispatch(fetchGamesPerPage());
                }
              }
            }}>
            <Image source={require('../assets/close.png')} />
          </Clear>
        </SortWrapper>
        <FilterWrapper>
          <SelectDropdown
            data={platforms}
            ref={dropdownRefPlatforms}
            defaultButtonText="Фильтр по платформам"
            buttonStyle={{
              width: '85%',
              backgroundColor: '#151515',
              borderBottomColor: '#fff',
              borderBottomWidth: 1,
            }}
            buttonTextStyle={{color: '#fff'}}
            rowStyle={{backgroundColor: '#151515'}}
            rowTextStyle={{color: '#fff'}}
            onSelect={async (selectedItem, index) => {
              const {id} = selectedItem;
              setFilter(id);
              setPage(2);
              index !== ''
                ? dispatch(fetchFilteredGames({id, order, text, searched}))
                : dispatch(fetchFilteredGames({id, searched}));
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
          />
          <Clear
            onPress={() => {
              if (filter === '') {
                return;
              }
              dropdownRefPlatforms.current.reset();
              setFilter('');
              setPage(2);
              if (searched) {
                if (order !== '') {
                  dispatch(fetchSortedGames({order, text, searched}));
                } else {
                  dispatch(fetchSearchGame(text));
                }
              } else {
                if (order !== '') {
                  dispatch(fetchSortedGames({order, text, searched}));
                } else {
                  dispatch(fetchGamesPerPage());
                }
              }
            }}>
            <Image source={require('../assets/close.png')} />
          </Clear>
        </FilterWrapper>
        <SearchWrapper>
          <SearchField
            value={text}
            placeholder="Поиск"
            onChangeText={setText}
            placeholderTextColor="#fff"
          />
          <ClearSearch
            onPress={() => {
              if (text === '') {
                return;
              }
              setText('');
              setSearched(false);
              if (order !== '' && filter !== '') {
                setPage(2);
                dispatch(fetchSearchGame({order, filter}));
              } else if (order !== '' && filter === '') {
                setPage(2);
                dispatch(fetchSortedGames({order, text, searched}));
              } else if (order === '' && filter !== '') {
                setPage(2);
                dispatch(fetchFilteredGames({filter, text, searched}));
              } else {
                setPage(2);
                dispatch(fetchGamesPerPage());
              }
            }}>
            <Image source={require('../assets/close.png')} />
          </ClearSearch>
        </SearchWrapper>
      </FormWrapper>
      {gamesStatus === 'succeeded' ? (
        <FlatList
          data={games}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
        />
      ) : (
        <View>{content}</View>
      )}
    </MainWrapper>
  );
};
