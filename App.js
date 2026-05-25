import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';

export default function App() {
  const[precoEtanol, setPrecoEtanol] = useState("");
  const[precoGasolina, setPrecoGasolina] = useState("");
  const[resultado, setResultado] = useState("");
  function calcular(){
    const calculo = precoEtanol/precoGasolina;
    if(calculo<0.7){
      setResultado("Etanol é a melhor opcao");
    }else{
      setResultado("Gasolina é a melhor opcao")
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>ALCOOL OU GASOLINA</Text>
      <TextInput style={styles.input}
      value={precoEtanol} 
      onChangeText = {setPrecoEtanol}
      placeholder = "Digite o preco do etanol"/>
      <TextInput style={styles.input}
      value={precoGasolina} 
      onChangeText = {setPrecoGasolina}
      placeholder = "Digite o preco da Gasolina"/>
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
    alignItems: 'center'
  },

  input: {
    height: 20
  },

  botao: {
   
  },

  botaoTexto: {
    
  },
});
