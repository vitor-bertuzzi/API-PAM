import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Image, FlatList, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import { globalStyles } from '../styles/globalStyles';
import BotaoCustomizado from '../components/BotaoCustomizado';

export default function RegistroVisitaScreen() {
    const [localizacao, setLocalizacao] = useState(null);
    const [imageEvidencia, setImagemEvidencia] = useState(null);
    const [contatoSelecionado, setContatoSelecionado] = useState(null);
    const [listaContatosDisponiveis, setListaContatosDisponiveis] = useState([]);
    const [erroGPS, setErroGPS] = useState(null);

    const capturarCoodernadasGPS = async () => {
        try {
            setErroGPS(null);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Erro de Permissão', 'O acesso ao GPS é vital para a validação legal da auditoria.');
                return;
            }
            const posicao = await Location.getCurrentPositionAsync({ 
                accuracy: Location.Accuracy.BestForNavigation 
            });
            setLocalizacao(posicao.coords);
        } catch (error) {
            setErroGPS('Não foi possível acessar o GPS. Verifique se o sensor do aparelho está ativo.');
        }
    };

    const capturarFotoEvidencia = async () => {
        const resultadoPermissao = await ImagePicker.requestCameraPermissionsAsync();
        const { status, canAskAgain } = resultadoPermissao;

        if (status === 'denied' && !canAskAgain) {
            Alert.alert(
                'Permissão Necessária',
                'Você bloqueou o acesso à câmera permanentemente. Para registrar fotos, abra as configurações do sistema e ative a permissão manualmente.',
                [{ text: 'Cancelar', style: 'cancel' },
                { text: 'Abrir Configurações', onPress: () => Linking.openSettings() }]
            );
            return;
        }

        if (status !== 'granted') {
            Alert.alert('Erro de Permissão', 'Acesso à câmera é obrigatório para o registro fotodocumental.');
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: false
        });

        if (!resultado.canceled) {
            setImagemEvidencia(resultado.assets[0].uri);
        }
    };

    const carregarContatosProdutores = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Erro', 'Não é possível carregar os representantes locais sem acesso aos contatos.');
            return;
        }
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        setListaContatosDisponiveis(data.slice(0, 3));
    };

    const finalizarRelatorioAuditoria = () => {
        if (!localizacao || !imageEvidencia || !contatoSelecionado) {
            Alert.alert(
                'Inconformidade de Dados', 
                'Todos os critérios de auditoria (GPS, Evidência Visual e Produtor Vinculado) devem ser preenchidos.'
            );
            return;
        }
        Alert.alert('Auditoria Concluída', 'Relatório de Visita Técnica sincronizado com a central de exportação com sucesso.');
    };

    return (
        <ScrollView style={globalStyles.container} nestedScrollEnabled={true}>
            
            
            <View style={globalStyles.cardVisita}>
                <Text style={globalStyles.tituloSecao}>1. Georreferenciamento de Lote</Text>
                <BotaoCustomizado titulo="Marcar Localização Atual" onPress={capturarCoodernadasGPS} tipo="primary" />
                {erroGPS && <Text style={{ color: '#E67E22', marginVertical: 5 }}>{erroGPS}</Text>}
                
                {localizacao && (
                    <View style={{ marginTop: 8 }}>
                        <Text style={globalStyles.textoInformativo}>Lat: {localizacao.latitude.toFixed(6)}</Text>
                        <Text style={globalStyles.textoInformativo}>Long: {localizacao.longitude.toFixed(6)}</Text>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                            <View style={{
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                marginRight: 8,
                                backgroundColor: localizacao.accuracy < 10 ? 'green' : localizacao.accuracy <= 30 ? 'yellow' : 'red'
                            }} />
                            <Text style={globalStyles.textoInformativo}>
                                Precisão Alvo: {localizacao.accuracy.toFixed(1)}m ({localizacao.accuracy < 10 ? 'Alta' : localizacao.accuracy <= 30 ? 'Média' : 'Baixa'})
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={globalStyles.cardVisita}>
                <Text style={globalStyles.tituloSecao}>2. Evidência de Qualidade de Grãos</Text>
                <BotaoCustomizado titulo="Acionar Câmera de Campo" onPress={capturarFotoEvidencia} tipo="warning"/>
                
                {imageEvidencia && (
                    <Image source={{ uri: imageEvidencia }} style={[globalStyles.imagePreview, { marginTop: 10 }]} />
                )}
            </View>

            <View style={globalStyles.cardVisita}>
                <Text style={globalStyles.tituloSecao}>3. Produtor / Representante Logístico</Text>
                <BotaoCustomizado titulo="Buscar Produtores na Agenda" onPress={carregarContatosProdutores} tipo="primary" />
                
                {contatoSelecionado && (
                    <Text style={[globalStyles.textoInformativo, { color: '#27AE60', fontWeight: 'bold', marginVertical: 6 }]}>
                        Vinculado a: {contatoSelecionado.name}
                    </Text>
                )}
                
                <FlatList
                    data={listaContatosDisponiveis}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <Text style={globalStyles.itemListaContato} onPress={() => setContatoSelecionado(item)}>
                            {item.name}
                        </Text>
                    )}
                />
            </View>

            <BotaoCustomizado titulo="Finalizar e Assinar Auditoria" onPress={finalizarRelatorioAuditoria} tipo="success" />
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}
