import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';



const NEWS_API_KEY = Constants.expoConfig.extra?.NEWS_API_KEY;

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
}


export default function HomeScreen() {
  const [query, setQuery] = useState<string>(''); 
  const [results, setResults] = useState<Article[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(''); 

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: { q: query, apiKey: NEWS_API_KEY }
      });
      setResults(response.data.articles);
    } catch (err) {
      setError('Error fetching news')
    } finally {
      setLoading(false)
    }
  }


  return (
    <View style={styles.container}>
      <ThemedText type='title'>Search News</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter search term"
        value={query}
        onChangeText={setQuery}
        placeholderTextColor="#888"
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loading} />}
      {error && <ThemedText type="error">{error}</ThemedText>}

      <FlatList
        data={results}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.item}>
            {item.urlToImage && (
              <Image
                source={{ uri: item.urlToImage }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            <ThemedText type='defaultSemiBold'>{item.title}</ThemedText>
            <ThemedText type='default'>{item.description}</ThemedText>
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <ThemedText type='link'>Read more</ThemedText>
            </TouchableOpacity> 
          </ThemedView>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginTop: 20
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

