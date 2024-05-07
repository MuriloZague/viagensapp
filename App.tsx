import React from 'react';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import { View, StyleSheet, Text, TextInput, StatusBar, Platform, Pressable, ScrollView, ActivityIndicator, Alert,
         Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import dotenv from 'react-native-config'
import axios from 'axios';


const geminiApiKey = process.env.GEMINI_API_KEY;

const StatusBarHeight = StatusBar.currentHeight

export default function App() {

  const [city, setCity] = useState("");
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("");


  async function generateItinerary() {

    try {
    if(city === ""){
      Alert.alert("Atenção!", "Preencha o nome da cidade")
      return;
    }
    setLoading(true);
    Keyboard.dismiss();

    const response = await axios.post(
      'https://api.ai.google.com/v1/dialog',
      {
        queryInput: {
          text: {
            text: `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias na cidade de ${city}, busque por lugares turísticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`,
            languageCode: 'pt-BR',
          },
        },
        queryParams: {
          key: geminiApiKey,
        },
      }
    );
    
    const itinerary = response.data.queryResult.fulfillmentText;
    setTravel(itinerary)
    setLoading(false);

  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Falha ao gerar roteiro. Verifique sua conexão com a internet.");
  }
  }
    
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} translucent={true} backgroundColor={"#f1f1f1"}/>
      <Text style={styles.heading}>Roteiros de Viagem</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Cidade Destino</Text>
        <TextInput 
          placeholder='Ex: São Paulo, SP'
          style={styles.input}
          value={city}
          onChangeText={ (text) => setCity(text) }
        />

        {/** USAR O .toFixed(0) para escolher 0 casas decimais no número de dias */}
        <Text style={styles.label}>Tempo de estadia: <Text style={styles.days}> {days.toFixed(0)} </Text> dias</Text> 

        <Slider
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={(value) => setDays(value)}
        />
      </View>
      <Pressable style={styles.button} onPress={generateItinerary}>
        <Text style={styles.buttonText}>Gerar Roteiro</Text>
        <MaterialIcons name='travel-explore' size={24} color={"white"}/>
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 18, marginTop: 4, }} 
      style={styles.containerScroll} showsVerticalScrollIndicator={false}>
        
        {/** SE O LOADING FOR 'TRUE' APARECERÁ ESSA VIEW */}
        {loading && (
          <View style={styles.content}>
          <Text style={styles.tittle}>Carregando Roteiro</Text>
          <ActivityIndicator size='small' />
        </View>
        )}
        
        {/** VERIFICA SE EXISTE ALGUM CONTEÚDO NO BLOCO TRAVEL (se existir ele mostra a view)*/}
        {travel && (
              <View style={styles.content}>
                <Text style={styles.tittle}>Roteiro da viagem 👇</Text>
                <Text>{travel}</Text>
              </View>
      )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f1f1f1",
      alignItems: 'center',
      paddingTop: 20,
    },
    heading: {
      fontSize: 32,
      fontWeight: 'bold',
      paddingTop: Platform.OS == 'android' ? StatusBarHeight : 54,
    },
    form: {
      backgroundColor: "#fff",
      width: "90%",
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
      marginBottom: 8,
    },
    label: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderRadius: 4,
      borderColor: "#94a3b8",
      padding: 8,
      fontSize: 16,
      marginBottom: 16,
    },
    days: {
      backgroundColor: "#f1f1f1"
    },
    button: {
      backgroundColor: "#FF5656",
      width: "90%",
      borderRadius: 8,
      flexDirection: 'row',
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    buttonText: {
      fontSize: 16,
      color: "#fff",
      fontWeight: 'bold',
    },
    content: {
      backgroundColor: "#fff",
      padding: 16,
      width: "100%",
      marginTop: 16,
      borderRadius: 8,
    },
    tittle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 14,
    },
    containerScroll: {
      width: "90%",
      marginTop: 8,
    },
});