import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import Loading from '../components/Loading';
import { debounce } from 'lodash';
import { fallbackMoviePoster, fetchSearchMovies, image185 } from '../api/moviedb';

var { width, height } = Dimensions.get('window');
const ios = Platform.OS == 'ios';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  

  const handleSearch = (value) => {
    if(value && value.length>2){
      setLoading(true)
      fetchSearchMovies({
        query: value,
        include_adult: false,
        language: 'en-US',
        page: 1,
      })
       .then((data) => {
         setLoading(false)
          if(data && data.results) setResults(data.results)
          if(data.results.length == 0) setError(true)
        })
       .catch((error) => {
         setLoading(false)
         setError(true)
          console.log('error: ', error)
        })
    }else{
      setLoading(false)
      setResults([])
    }
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 500), [])

  return (
    <SafeAreaView style={{paddingTop: ios ? '' : 45}} className="bg-neutral-800 flex-1">
      <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movie"
          placeholderTextColor={'lightgray'}
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="rounded-full p-3 m-1 bg-neutral-500"
        >
          <XMarkIcon size="25" color={'white'} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className="space-y-3"
        >
          <Text className="text-white font-semibold ml-1">
            Results ({results.length})
          </Text>
          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => {
              const movieName = item.title
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push('Movie', item)}
                >
                  <View className="space-y-2 mb-4">
                    <Image
                      className="rounded-3xl"
                      // source={require('../images/movie-poster.jpg')}
                      source={{uri: image185(item.poster_path) || fallbackMoviePoster}}
                      style={{ width: width * 0.44, height: height * 0.3 }}
                    />
                    <Text className="text-neutral-300 ml-1">
                      {movieName.length > 22
                        ? movieName.slice(0, 22) + '...'
                        : movieName}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : error ? (
        <View className="flex-row justify-center">
          <Image
            source={require('../images/not-found.png')}
            className="h-96 w-96"
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default SearchScreen;
