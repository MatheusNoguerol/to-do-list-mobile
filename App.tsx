import React, {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Alert} from "react-native";


import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const About = () => {

  const [task, setTask] = useState(['']);
  const [newTask, setNewTask] = useState('');


  async function addTask() {

    if(newTask == ''){
      return;
    }

    const search = task.filter(task => task === newTask)

    if(search.length != 0){
      Alert.alert('Atenção!', 'Tarefa já cadastrada.');
      setNewTask("");
      return;
    }

    setTask([ ... task, newTask]);
    setNewTask("");
    Keyboard.dismiss();
  }

  async function removeTask(item:string){
    Alert.alert(
    "Deletar tarefa",
    "Tem certeza que deseja deletar essa tarefa?",
    [
      {
        text: 'Cancelar',
        onPress: () => {
          return;
        },
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: () => {
          setTask(task.filter(tasks => tasks != item))
        }
      }
    ],
    {cancelable: false}
    )
  }

  useEffect(() => {
    async function carregaDados(){
      const task = await AsyncStorage.getItem("task")

      if(task){
        setTask(JSON.parse(task));
      }
    }

    carregaDados();
  } , [])

  useEffect(() => {
    async function saveData(){
      AsyncStorage.setItem("task", JSON.stringify(task))
    }

    saveData();
  }, [task])

    
  return(
    <KeyboardAvoidingView 
      keyboardVerticalOffset={0}
      behavior="padding"
      style={{flex: 1}}
      enabled={ Platform.OS === 'ios' }
    >
      <View style={styles.container}>
        <View style={styles.inicio}>
          <Text style={styles.todolist}>Lista de tarefas!</Text>
        </View>
        <View style={styles.body}>
          <FlatList 
            style={styles.FlatList} 
            data={task} 
            keyExtractor={item => item.toString()} 
            showsVerticalScrollIndicator={false} 
            renderItem={({ item }) => (
              <View style={styles.containerView}>
                <Text style={styles.texto}>{item}</Text>
                <TouchableOpacity onPress={() => removeTask(item)}>
                  <MaterialIcons name="delete-forever" size={25} color="#f64c75"></MaterialIcons>
                </TouchableOpacity>
              </View>
            )}>
          </FlatList>
        </View>
        <View style={styles.form}>    
          <TextInput 
            style={styles.input}
            placeholder="Adicione uma tarefa..."
            placeholderTextColor="#999"
            maxLength={25}
            onChangeText={text => setNewTask(text)}
            value={newTask}
          />
          <TouchableOpacity style={styles.button} onPress={() => addTask()}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 20, 
      marginTop: 20,
    },

    FlatList: {
      flex: 1,
      fontFamily: 'JetBrains Mono',
      marginTop: 5
    },

    input: {
      flex: 1,
      height: 40,
      backgroundColor: "#eee",
      borderRadius: 4,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "#eee"
    },

    form: {
      padding: 0,
      height: 60,
      justifyContent: 'center',
      alignSelf: 'stretch',
      flexDirection: 'row',
      paddingTop: 13,
      borderTopWidth: 1,
      borderColor: '#eee',
    },

    body: {
      flex: 1
    },

    button: {
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1c6cce',
      borderRadius: 4,
      marginLeft: 10
    },

    containerView: {
      marginBottom: 15,
      padding: 15,
      borderRadius: 4,
      backgroundColor: '#eee',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#eee'
    },

    texto: {
      fontSize: 14,
      color: '#333',
      fontWeight: 'bold',
      marginTop: 4,
      textAlign: 'center',
    },

    todolist: {
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold'
    },

    inicio: {
      flex: 1,
      alignItems: 'center'
    }
})

export default About;