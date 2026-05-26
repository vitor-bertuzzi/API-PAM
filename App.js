import PostoImage from './src/components/posto.jpg';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';


export default function App() {
  const[precoEtanol, setPrecoEtanol] = useState("");
  const[precoGasolina, setPrecoGasolina] = useState("");
  const[resultado, setResultado] = useState("");
  function calcular(){
    const calculo = precoEtanol/precoGasolina;
    if(calculo<0.7){
      setResultado("Abasteça com: ETANOL\n O etanol está custando "+ calculo+"% da gasolina");
    }else{
      setResultado("Abasteça com: GASOLINA\n O etanol está custando "+ calculo+"% da gasolina")
    }
  }
  return (
    
    <View style={styles.container}>
     
      <Text style={styles.titulo}>ALCOOL OU GASOLINA</Text>
      <Image source={PostoImage} style={styles.Image} />
      <TextInput style={styles.input}
      value={precoEtanol} 
      onChangeText = {setPrecoEtanol}
      placeholder = "Preço do Etanol:"/>
      <TextInput style={styles.input}
      value={precoGasolina} 
      onChangeText = {setPrecoGasolina}
      placeholder = "Preco da Gasolina:"/>
      <TouchableOpacity onPress={calcular} style={styles.botao}>
      <Text style={styles.botaoTexto}>VERIFICAR VANTAGEM</Text>
      </TouchableOpacity>
      <Text>{resultado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulo: {
    fontSize: 20,
    alignItems: 'center',
  },

  input: {
    height: 20,
    backgroundColor: 'yellow',
    borderRadius: 5
  },

  botao: {
   backgroundColor: 'red',
   borderRadius: 5
  },

  botaoTexto: {
    
  },

  Image: {
    width: 150,
    height: 150,
  },
});
